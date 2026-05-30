import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MetricsBoard, ClusterView, AnalyticsCharts } from './components/DashboardPieces';
import { JobTables } from './components/JobTables';
import { createInitialState, tickSimulation, submitJob } from './lib/simulator';
import { generateMLWorkload } from './lib/jobGenerator';
import { Algorithm, GPUJob, SimulationState } from './types';

export default function App() {
  const [state, setState] = useState<SimulationState>(() => createInitialState('SRTF'));
  const [isRunning, setIsRunning] = useState(false);
  const [tickRate, setTickRate] = useState(200); // 200ms per tick

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(() => {
        setState(current => tickSimulation(current));
      }, tickRate);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickRate]);

  const handleSetAlgorithm = (alg: Algorithm) => {
    setState(s => ({ ...s, algorithm: alg }));
  };

  const handleSubmitJob = (job: GPUJob) => {
    job.arrivalTime = state.time; // Synchronize with simulation clock
    setState(s => submitJob(s, job));
  };

  const handleAddBulk = () => {
    const jobs = generateMLWorkload(20, state.time);
    setState(s => {
      let nextState = s;
      for (const j of jobs) {
        nextState = submitJob(nextState, j);
      }
      return nextState;
    });
  };

  const handleClear = () => {
    setIsRunning(false);
    setState(s => createInitialState(s.algorithm));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans">
      <Sidebar 
        algorithm={state.algorithm}
        setAlgorithm={handleSetAlgorithm}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        tickRate={tickRate}
        setTickRate={setTickRate}
        onSubmitJob={handleSubmitJob}
        onAddBulk={handleAddBulk}
        onClear={handleClear}
      />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cluster Dashboard</h1>
              <p className="text-slate-400 mt-1">Simulation Time: T = {state.time} minutes</p>
            </div>
          </div>

          <MetricsBoard state={state} />
          <ClusterView cores={state.cores} />
          <AnalyticsCharts history={state.history} />
          <JobTables jobs={state.jobs} />
        </div>
      </main>
    </div>
  );
}
