import { GPUJob } from '../types';
import { cn } from '../lib/utils';

export function JobTables({ jobs }: { jobs: GPUJob[] }) {
  const queued = jobs.filter(j => j.status === 'QUEUED' || j.status === 'PREEMPTED');
  const running = jobs.filter(j => j.status === 'RUNNING');
  const completed = jobs.filter(j => j.status === 'COMPLETED').reverse().slice(0, 50);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* QUEUED & RUNNING */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
        <div className="p-4 border-b border-slate-800 font-semibold text-white flex justify-between">
          <span>Active Queue</span>
          <span className="bg-blue-500/20 text-blue-400 py-0.5 px-2 rounded-full text-xs">{queued.length} Queued, {running.length} Running</span>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 capitalize bg-slate-900 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium">Job Name</th>
                <th className="px-4 py-2 font-medium">Tier</th>
                <th className="px-4 py-2 font-medium text-right">Remaining</th>
                <th className="px-4 py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...running, ...queued].map(job => (
                <tr key={job.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-2 font-medium text-slate-200">
                    <div>{job.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">Prio {job.priority}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px]", 
                      job.tier === 'Premium' ? "bg-amber-500/10 text-amber-500" :
                      job.tier === 'Regular' ? "bg-slate-700/50 text-slate-300" : "bg-slate-800 text-slate-500"
                    )}>
                      {job.tier}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-slate-300 break-words">{job.remainingTime} m</td>
                  <td className="px-4 py-2 text-right">
                    <span className={cn("px-2 py-1 rounded text-xs", 
                      job.status === 'RUNNING' ? "bg-emerald-500/10 text-emerald-500" :
                      job.status === 'PREEMPTED' ? "bg-rose-500/10 text-rose-500" : "bg-slate-800 text-slate-400"
                    )}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
              {queued.length === 0 && running.length === 0 && (
                <tr className="text-center text-slate-500"><td colSpan={4} className="py-8">No active jobs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPLETED */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[400px]">
        <div className="p-4 border-b border-slate-800 font-semibold text-white flex justify-between">
          <span>Completed Log</span>
          <span className="bg-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full text-xs">Recent {completed.length}</span>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 capitalize bg-slate-900 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium">Job Name</th>
                <th className="px-4 py-2 font-medium text-right">Turnaround</th>
                <th className="px-4 py-2 font-medium text-right">Wait Time</th>
              </tr>
            </thead>
            <tbody>
              {completed.map(job => {
                const turnaround = (job.completionTime || 0) - job.arrivalTime;
                const wait = (job.startTime !== undefined ? job.startTime : job.arrivalTime) - job.arrivalTime;
                return (
                 <tr key={job.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-300">{job.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-400">{turnaround} m</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-400/80">{wait} m</td>
                 </tr>
                );
              })}
              {completed.length === 0 && (
                <tr className="text-center text-slate-500"><td colSpan={3} className="py-8">No completed jobs</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
