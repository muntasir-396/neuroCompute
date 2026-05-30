export type JobType = 
  | 'Deep Learning Training'
  | 'Hyperparameter Tuning'
  | 'Model Inference'
  | 'Data Preprocessing'
  | 'Batch Prediction';

export type UserTier = 'Premium' | 'Regular' | 'Free';
export type Algorithm = 'FCFS' | 'SJF' | 'SRTF' | 'Priority' | 'RoundRobin';
export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PREEMPTED';

export interface GPUJob {
  id: string;
  name: string;
  type: JobType;
  tier: UserTier;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  startTime?: number;
  completionTime?: number;
  priority: number; // Lower number = higher priority
  coresNeeded: number;
  vramNeeded: number;
  power: number;
  status: JobStatus;
  waitDuration: number;
  quantumUsed?: number; // for Round Robin
  critical?: boolean;
}

export interface GPUCore {
  id: number;
  isAvailable: boolean;
  currentJobId?: string;
  utilization: number;
  temp: number;
  power: number;
}

export interface SimulatorMetrics {
  totalJobsProcessed: number;
  totalWaitTime: number;
  totalTurnaroundTime: number;
  totalContextSwitches: number;
  failedJobs: number;
}

export interface SimulationState {
  time: number;
  algorithm: Algorithm;
  cores: GPUCore[];
  jobs: GPUJob[];
  metrics: SimulatorMetrics;
  history: Array<{ time: number; utilization: number; avgWait: number }>;
}
