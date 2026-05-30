import React from 'react';
import { Cpu, Activity, Clock, Zap } from 'lucide-react';
import { SimulatorMetrics, GPUCore, SimulationState } from '../types';
import { cn } from '../lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';

export function MetricsBoard({ state }: { state: SimulationState }) {
  const totalCompleted = state.metrics.totalJobsProcessed || 1;
  const avgWait = (state.metrics.totalWaitTime / totalCompleted).toFixed(1);
  const activeJobs = state.jobs.filter(j => j.status === 'RUNNING' || j.status === 'QUEUED' || j.status === 'PREEMPTED').length;
  
  const currentUtil = state.cores.reduce((sum, core) => sum + core.utilization, 0) / state.cores.length;
  const currentPower = state.cores.reduce((sum, core) => sum + core.power, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card icon={<Activity className="w-5 h-5 text-emerald-500"/>} title="Avg Waiting Time" value={`${avgWait} min`} sub={`${state.metrics.totalJobsProcessed} jobs processed`} />
      <Card icon={<Cpu className="w-5 h-5 text-blue-500"/>} title="Cluster Utilization" value={`${currentUtil.toFixed(1)}%`} sub={`${state.cores.filter(c => !c.isAvailable).length} / 8 Cores Busy`} />
      <Card icon={<Clock className="w-5 h-5 text-purple-500"/>} title="Context Switches" value={state.metrics.totalContextSwitches.toString()} sub="Overhead tracked" />
      <Card icon={<Zap className="w-5 h-5 text-amber-500"/>} title="Power Consumption" value={`${currentPower.toFixed(0)} W`} sub="Out of 2400W MAX" />
    </div>
  );
}

function Card({ icon, title, value, sub }: { icon: React.ReactNode; title: string; value: string; sub: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
      <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium text-sm">
        {icon}
        {title}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 mt-auto">{sub}</div>
    </div>
  );
}

export function ClusterView({ cores }: { cores: GPUCore[] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
      <h2 className="text-white font-semibold mb-4 flex items-center justify-between">
        GPU Cluster Status
        <span className="text-xs text-slate-400 font-normal">8x RTX 3080</span>
      </h2>
      <div className="space-y-3">
        {cores.map((core) => (
          <div key={core.id} className="relative">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-mono">Core {core.id}</span>
              <span className="text-slate-400">
                {core.isAvailable ? 'IDLE' : `${core.currentJobId}`} · {core.utilization.toFixed(0)}%
              </span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                className={cn(
                  "h-full transition-all duration-300", 
                  core.utilization > 80 ? "bg-rose-500" : core.utilization > 0 ? "bg-blue-500" : "bg-slate-800"
                )}
                style={{ width: `${core.utilization}%` }}
              />
            </div>
            <div className="flex gap-2 text-[10px] text-slate-500 mt-0.5 justify-end font-mono">
              <span>{Math.round(core.temp)}°C</span>
              <span>{Math.round(core.power)}W</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsCharts({ history }: { history: Array<{ time: number; utilization: number; avgWait: number }> }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
      <h2 className="text-white font-semibold mb-4">Performance Metrics</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
            <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false}/>
            <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
              itemStyle={{ color: '#bae6fd' }}
            />
            <Area type="monotone" dataKey="utilization" name="Utilization (%)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" />
            <Line type="monotone" dataKey="avgWait" name="Avg Wait (min)" stroke="#10b981" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
