
import React, { useState } from 'react';
import { 
  X, 
  ClipboardList, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  Briefcase,
  Flag
} from 'lucide-react';
import { Resource, Project, SuggestedTask } from '../types';
import { suggestTask } from '../services/geminiService';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource | null;
  projects: Project[];
  onAssign: (task: any) => void;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ isOpen, onClose, resource, projects, onAssign }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !resource) return null;

  const handleAiSuggest = async () => {
    if (!selectedProjectId) {
      setErrors({ project: 'Please select a project first' });
      return;
    }
    
    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    setIsAiGenerating(true);
    setErrors({});
    try {
      const suggestion = await suggestTask(resource, project);
      setTaskTitle(suggestion.title);
      setDescription(suggestion.description);
      setPriority(suggestion.priority);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const validate = () => {
    const newErrs: Record<string, string> = {};
    if (!selectedProjectId) newErrs.project = 'Project is required';
    if (!taskTitle) newErrs.title = 'Task title is required';
    if (!dueDate) newErrs.date = 'Due date is required';
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAssign({
      projectId: selectedProjectId,
      resourceId: resource.id,
      title: taskTitle,
      description,
      priority,
      dueDate,
      status: 'Pending'
    });
    
    onClose();
    // Reset
    setTaskTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assign New Task</h2>
              <p className="text-slate-500 text-sm font-medium">Assigning to <span className="text-blue-600 font-bold">{resource.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Project Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" /> Select Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setErrors({});
              }}
              className={`w-full px-4 py-3 rounded-xl border ${errors.project ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer`}
            >
              <option value="">Choose a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            {errors.project && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.project}</p>}
          </div>

          {/* AI Suggestion Trigger */}
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isAiGenerating || !selectedProjectId}
            className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-all disabled:opacity-50 border border-blue-100"
          >
            {isAiGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isAiGenerating ? 'AI is thinking...' : 'Suggest Task with Linkare AI'}
          </button>

          {/* Task Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Task Title</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Implement Auth Flow"
              className={`w-full px-4 py-3 rounded-xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all`}
            />
            {errors.title && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Flag size={16} className="text-slate-400" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${errors.date ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Task Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the task requirements and expectations..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all leading-relaxed"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4 shrink-0">
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
            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Assign Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
