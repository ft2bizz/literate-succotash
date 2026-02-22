
import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Briefcase, 
  Percent, 
  Calendar, 
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Resource, Project } from '../types';

interface AllocateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  projects: Project[];
  onAllocate: (resourceId: string, projectId: string, percentage: number) => void;
}

const AllocateResourceModal: React.FC<AllocateResourceModalProps> = ({ isOpen, onClose, resource, projects, onAllocate }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select a project');
      return;
    }
    onAllocate(resource.id, selectedProjectId, percentage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <UserCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Allocate Talent</h2>
              <p className="text-slate-500 text-sm font-medium">Assigning <span className="text-indigo-600 font-bold">{resource.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" /> Target Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => { setSelectedProjectId(e.target.value); setError(''); }}
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer`}
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.id})</option>
              ))}
            </select>
            {error && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Percent size={16} className="text-slate-400" /> Allocation Load
              </label>
              <span className="text-lg font-black text-indigo-600">{percentage}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={percentage}
              onChange={(e) => setPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              <span>Partial</span>
              <span>Full Time</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Project Role (Optional)</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={resource.role}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              Current total allocation for this resource is <span className="font-bold">{resource.allocationPercentage}%</span>. 
              Adding {percentage}% will bring them to <span className="font-bold">{(resource.allocationPercentage || 0) + percentage}%</span>.
            </p>
          </div>
        </form>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
          >
            Confirm Allocation
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocateResourceModal;
