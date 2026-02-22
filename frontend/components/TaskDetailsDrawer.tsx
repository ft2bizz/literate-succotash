
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ClipboardList, 
  Clock, 
  Flag, 
  Users, 
  Tag, 
  MessageSquare, 
  Save, 
  CheckCircle2,
  Code2,
  Sparkles,
  // Added missing Activity import
  Activity
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, Project } from '../types';

interface TaskDetailsDrawerProps {
  task: Task | null;
  project: Project;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
}

const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ task, project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Task | null>(null);

  useEffect(() => {
    if (task) setFormData({ ...task });
  }, [task]);

  if (!task || !formData) return null;

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[80]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[90] overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Task Details</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {task.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Title & Description */}
          <section className="space-y-4">
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-2xl font-black text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-200"
              placeholder="Task Title"
            />
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full text-slate-500 font-medium border-none focus:ring-0 p-0 resize-none leading-relaxed"
              placeholder="Add a description..."
            />
          </section>

          {/* Meta Grid */}
          <section className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} /> Status
              </label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Flag size={12} /> Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} /> Assignee
              </label>
              <select 
                value={formData.assigneeId || ''}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-50 focus:border-blue-500 outline-none"
              >
                <option value="">Unassigned</option>
                {project.squad?.map(m => <option key={m.role} value={m.role}>{m.role}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> Estimate
              </label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
                <input 
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
                  className="w-full text-sm font-bold text-slate-700 border-none focus:ring-0 p-0"
                />
                <span className="text-[10px] font-black text-slate-400 uppercase">Hours</span>
              </div>
            </div>
          </section>

          {/* Development Notes */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Code2 size={18} className="text-blue-600" />
              Development Notes
            </h3>
            <textarea 
              value={formData.devNotes || ''}
              onChange={(e) => setFormData({ ...formData, devNotes: e.target.value })}
              rows={6}
              className="w-full p-6 bg-slate-900 text-blue-400 font-mono text-sm rounded-[2rem] border border-slate-800 focus:ring-4 focus:ring-blue-900/20 outline-none transition-all leading-relaxed"
              placeholder="// Input technical implementation details, API endpoints, or logic flow here..."
            />
          </section>

          {/* Technical Requirements */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-600" />
                Acceptance Criteria
              </h3>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Add Item</button>
            </div>
            <div className="space-y-2">
              {(formData.technicalRequirements || ['Requirement 1', 'Requirement 2']).map((req, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
                  <span className="text-sm font-bold text-slate-600">{req}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-3">
          <button 
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Save Task Updates
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskDetailsDrawer;
