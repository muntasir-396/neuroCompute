import React, { useState, useEffect } from 'react';
import { Play, Square, Settings2, Plus, Zap } from 'lucide-react';
import { Algorithm, GPUJob, JobType, UserTier } from '../types';
import { generateJobId } from '../lib/jobGenerator';
import { cn } from '../lib/utils';

export function Sidebar({
  algorithm,
  setAlgorithm,
  isRunning,
  setIsRunning,
  tickRate,
  setTickRate,
  onSubmitJob,
  onAddBulk,
}: {
  algorithm: Algorithm;
  setAlgorithm: (a: Algorithm) => void;
  isRunning: boolean;
  setIsRunning: (r: boolean) => void;
  tickRate: number;
  setTickRate: (r: number) => void;
  onSubmitJob: (job: GPUJob) => void;
  onAddBulk: () => void;
}) {
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState<JobType>('Deep Learning Training');
  const [epochs, setEpochs] = useState<number>(50);
  const [tier, setTier] = useState<UserTier>('Regular');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jName = jobName.trim() || `${jobType.split(' ')[0]}_Manual`;
    const newJob: GPUJob = {
      id: generateJobId(),
      name: jName,
      type: jobType,
      tier,
      arrivalTime: 0, // Gets overridden by simulator at Submission time
      burstTime: epochs,
      remainingTime: epochs,
      priority: tier === 'Premium' ? 1 : tier === 'Regular' ? 3 : 5,
      coresNeeded: 1,
      vramNeeded: 8, // mock
      power: 250,
      status: 'QUEUED',
      waitDuration: 0,
      critical: tier === 'Premium',
    };
    onSubmitJob(newJob);
    setJobName('');
  };

  return (
    <div className="w-80 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col h-full overflow-y-auto shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">NeuroCompute</h1>
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Simulation Control</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Scheduling Algorithm</label>
            <select 
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="FCFS">First Come First Serve (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="SRTF">Shortest Remaining Time (SRTF)</option>
              <option value="Priority">Priority Queue (w/ Aging)</option>
              <option value="RoundRobin">Round Robin (RR)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1 block">Speed (ms per tick)</label>
            <input 
              type="range" min="50" max="1000" step="50"
              value={tickRate}
              onChange={(e) => setTickRate(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Fast (50ms)</span>
              <span>1 Tick = 1 Min</span>
              <span>Slow (1s)</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors",
                isRunning 
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              )}
            >
              {isRunning ? <><Square className="w-4 h-4 fill-current"/> Stop</> : <><Play className="w-4 h-4 fill-current"/> Start</>}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Submit Job</h2>
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Job Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. ResNet50_Run"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Job Type</label>
            <select 
              value={jobType}
              onChange={(e) => setJobType(e.target.value as JobType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Deep Learning Training">Deep Learning Training</option>
              <option value="Hyperparameter Tuning">Hyperparameter Tuning</option>
              <option value="Model Inference">Model Inference</option>
              <option value="Data Preprocessing">Data Preprocessing</option>
              <option value="Batch Prediction">Batch Prediction</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Est. Time / Epochs</label>
            <input 
              type="range" min="1" max="120"
              value={epochs}
              onChange={(e) => setEpochs(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="text-right text-xs text-slate-500">{epochs} mins</div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">User Tier</label>
            <select 
              value={tier}
              onChange={(e) => setTier(e.target.value as UserTier)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-sm text-slate-200 outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Premium">Premium</option>
              <option value="Regular">Regular</option>
              <option value="Free">Free</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4"/>
            Add to Queue
          </button>
        </form>
      </div>

      <div className="mt-auto space-y-4 pt-4 border-t border-slate-800">
         <button
            onClick={onAddBulk}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Settings2 className="w-4 h-4"/>
            Generate Random Workload
          </button>
      </div>

    </div>
  );
}
