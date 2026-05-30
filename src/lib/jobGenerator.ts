import { GPUJob, JobType, UserTier } from '../types';

let jobCounter = 1;

export function generateJobId(): string {
  const pad = String(jobCounter++).padStart(3, '0');
  const d = new Date().toISOString().replace(/\D/g, '').slice(0, 8);
  return `JOB_${d}_${pad}`;
}

export function createRandomJob(currentTime: number, isCritical = false): GPUJob {
  const r = Math.random();
  let type: JobType = 'Deep Learning Training';
  let burstTime = 100;
  let priority = 3;

  if (r < 0.2) {
    type = 'Model Inference';
    burstTime = Math.floor(Math.random() * 5) + 1;
    priority = 1;
  } else if (r < 0.5) {
    type = 'Hyperparameter Tuning';
    burstTime = Math.floor(Math.random() * 15) + 5;
    priority = 3;
  } else if (r < 0.7) {
    type = 'Batch Prediction';
    burstTime = Math.floor(Math.random() * 30) + 10;
    priority = 4;
  } else if (r < 0.8) {
    type = 'Data Preprocessing';
    burstTime = Math.floor(Math.random() * 60) + 15;
    priority = 5;
  } else {
    type = 'Deep Learning Training';
    burstTime = Math.floor(Math.random() * 120) + 60;
    priority = 4;
  }

  const userR = Math.random();
  let tier: UserTier = 'Regular';
  if (userR > 0.8) { tier = 'Premium'; priority -= 1; }
  else if (userR < 0.3) { tier = 'Free'; priority += 1; }

  // Adjust bounds
  if (isCritical || type === 'Model Inference') priority = 1;
  priority = Math.max(1, Math.min(5, priority));

  return {
    id: generateJobId(),
    name: `${type.split(' ')[0]}_${Math.floor(Math.random() * 1000)}`,
    type,
    tier,
    priority,
    arrivalTime: currentTime,
    burstTime: burstTime,
    remainingTime: burstTime,
    coresNeeded: 1, // Simplified for this simulation context
    vramNeeded: Math.floor(Math.random() * 12) + 2,
    power: Math.floor(Math.random() * 200) + 100, // 100W - 300W
    status: 'QUEUED',
    waitDuration: 0,
    critical: isCritical || priority === 1,
  };
}

export function generateMLWorkload(count: number, currentTime: number): GPUJob[] {
  const jobs: GPUJob[] = [];
  for (let i = 0; i < count; i++) {
    // Space out arrivals slightly or bunch them
    const t = currentTime + Math.floor(Math.random() * (count / 2));
    jobs.push(createRandomJob(t, i % 10 === 0)); // 10% critical
  }
  return jobs.sort((a, b) => a.arrivalTime - b.arrivalTime);
}
