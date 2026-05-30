import { Algorithm, GPUCore, GPUJob, SimulationState } from '../types';

const TIME_QUANTUM = 10; // For Round Robin

export function createInitialState(algorithm: Algorithm = 'SRTF'): SimulationState {
  return {
    time: 0,
    algorithm,
    cores: Array.from({ length: 8 }, (_, i) => ({
      id: i,
      isAvailable: true,
      utilization: 0,
      temp: 45,
      power: 20,
    })),
    jobs: [],
    metrics: {
      totalJobsProcessed: 0,
      totalWaitTime: 0,
      totalTurnaroundTime: 0,
      totalContextSwitches: 0,
      failedJobs: 0,
    },
    history: [],
  };
}

export function submitJob(state: SimulationState, job: GPUJob): SimulationState {
  return {
    ...state,
    jobs: [...state.jobs, job],
  };
}

// Clone deeply to avoid React state mutation issues when updating nested objects
const cloneState = (s: SimulationState): SimulationState => JSON.parse(JSON.stringify(s));

export function tickSimulation(state: SimulationState): SimulationState {
  const next = cloneState(state);
  next.time += 1;

  // 1. Process active running jobs
  for (const core of next.cores) {
    if (!core.isAvailable && core.currentJobId) {
      const job = next.jobs.find((j) => j.id === core.currentJobId);
      if (job) {
        job.remainingTime -= 1;
        job.quantumUsed = (job.quantumUsed || 0) + 1;

        // Has the job completed?
        if (job.remainingTime <= 0) {
          job.status = 'COMPLETED';
          job.completionTime = next.time;
          
          next.metrics.totalJobsProcessed += 1;
          const waitTime = (job.startTime !== undefined ? job.startTime : job.arrivalTime) - job.arrivalTime;
          next.metrics.totalWaitTime += waitTime;
          next.metrics.totalTurnaroundTime += (next.time - job.arrivalTime);

          // Free core
          core.isAvailable = true;
          core.currentJobId = undefined;
          core.utilization = 0;
          core.temp = 45; // Cool down
          core.power = 20; // idle power
        }
      }
    }
  }

  // 2. Preemption rules
  if (next.algorithm === 'RoundRobin') {
    for (const core of next.cores) {
      if (!core.isAvailable && core.currentJobId) {
        const job = next.jobs.find((j) => j.id === core.currentJobId);
        if (job && job.quantumUsed && job.quantumUsed >= TIME_QUANTUM && job.remainingTime > 0) {
          // Time slice expired, preempt
          job.status = 'PREEMPTED';
          job.quantumUsed = 0;
          job.arrivalTime = next.time; // move to back by tricking arrival time for RR
          
          next.metrics.totalContextSwitches += 1;
          core.isAvailable = true;
          core.currentJobId = undefined;
        }
      }
    }
  } else if (next.algorithm === 'SRTF' || next.algorithm === 'Priority') {
    // Collect all active jobs (running or pending)
    let activeJobs = next.jobs.filter((j) => j.status !== 'COMPLETED');
    
    // Sort them exactly as we value them
    activeJobs = sortJobs(activeJobs, next.algorithm);
    
    // In our simplified GPU cluster, we have 8 single-job slots (1 core = 1 job).
    // The top N jobs should be running, where N <= number of cores.
    const maxActive = next.cores.length;
    const topJobs = activeJobs.slice(0, maxActive);
    
    // Check if any current running job is NOT in the top N
    for (const core of next.cores) {
      if (!core.isAvailable && core.currentJobId) {
        if (!topJobs.find((j) => j.id === core.currentJobId)) {
          // Preempt it!
          const job = next.jobs.find((j) => j.id === core.currentJobId);
          if (job) {
            job.status = 'PREEMPTED';
            next.metrics.totalContextSwitches += 1;
            core.isAvailable = true;
            core.currentJobId = undefined;
            core.utilization = 0;
            core.power = 20;
          }
        }
      }
    }
  }

  // Aging for Priority algorithm
  if (next.algorithm === 'Priority') {
    for (const job of next.jobs) {
      if (job.status === 'QUEUED' || job.status === 'PREEMPTED') {
        const waitingSince = next.time - job.arrivalTime;
        // Age every 5 ticks (minutes) if priority > 1
        if (waitingSince > 0 && waitingSince % 5 === 0 && job.priority > 1) {
          job.priority -= 1; 
        }
      }
    }
  }

  // 3. Allocate free cores
  let freeCores = next.cores.filter((c) => c.isAvailable);
  let pendingJobs = next.jobs.filter((j) => j.status === 'QUEUED' || j.status === 'PREEMPTED');

  // Sort queue by scheduling policy
  pendingJobs = sortJobs(pendingJobs, next.algorithm);

  for (const job of pendingJobs) {
    if (freeCores.length === 0) break;
    const core = freeCores.shift()!;
    
    job.status = 'RUNNING';
    if (job.startTime === undefined) {
      job.startTime = next.time;
    }
    
    core.isAvailable = false;
    core.currentJobId = job.id;
    core.utilization = job.vramNeeded > 8 ? 95 : 65; 
    core.temp = 60 + Math.random() * 20; 
    core.power = job.power;
  }

  // 4. Update wait durations for all queued
  for (const job of next.jobs) {
    if (job.status === 'QUEUED' || job.status === 'PREEMPTED') {
      job.waitDuration += 1;
    }
  }

  // 5. Track historical utilization
  const busyCores = next.cores.filter((c) => !c.isAvailable).length;
  const targetUtil = (busyCores / next.cores.length) * 100;
  
  const completedCount = next.metrics.totalJobsProcessed || 1; // avoid / 0
  const avgWait = next.metrics.totalWaitTime / completedCount;
  
  // Keep history manageable
  next.history.push({ 
    time: next.time, 
    utilization: targetUtil, 
    avgWait 
  });
  
  if (next.history.length > 60) next.history.shift();

  return next;
}

function sortJobs(jobs: GPUJob[], algorithm: Algorithm): GPUJob[] {
  return jobs.sort((a, b) => {
    switch (algorithm) {
      case 'FCFS':
        return a.arrivalTime - b.arrivalTime;
      case 'SJF':
        return a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime;
      case 'SRTF':
        return a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime;
      case 'Priority':
        return a.priority - b.priority || a.arrivalTime - b.arrivalTime;
      case 'RoundRobin':
        return a.arrivalTime - b.arrivalTime;
      default:
        return 0;
    }
  });
}
