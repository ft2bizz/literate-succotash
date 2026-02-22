
import React from 'react';
import { Project, ProjectStatus } from '../types';

export const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
  const styles = {
    'Active': 'bg-blue-100 text-blue-700',
    'Completed': 'bg-green-100 text-green-700',
    'On Hold': 'bg-slate-100 text-slate-700',
    'At Risk': 'bg-red-100 text-red-700'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>
      {status}
    </span>
  );
};

export const HealthIndicator: React.FC<{ health: Project['health'] }> = ({ health }) => {
  const colors = {
    'On Track': 'bg-green-500',
    'At Risk': 'bg-amber-500',
    'Critical': 'bg-red-500'
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[health]}`} />
      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{health}</span>
    </div>
  );
};
