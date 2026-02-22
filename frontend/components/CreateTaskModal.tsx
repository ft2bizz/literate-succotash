
import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Sparkles, 
  Loader2, 
  Target, 
  Users, 
  Clock, 
  Flag, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Project, Task, Epic, Resource, TaskPriority } from '../types';
import { suggestTask } from '../services/geminiService';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAdd: (task: Task) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, project, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [epicId, setEpicId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAiSuggest = async () => {
    // If an assignee is selected, we can get a more tailored suggestion
    // Otherwise, we use a generic squad member or just the project context
    const mockResource: Resource = {
      id: assigneeId || 'temp',
      name: project.squad?.find(s => s.role === assigneeId)?.role || 'Team Member',
      role: assigneeId || 'Developer',
      skills: [],
      availability: 'Available',
      experienceLevel: 'Senior',
      email: '', phone: '', location: '', bio: '', certifications: [], projectHistory: [], joinedDate: ''
    };

    setIsAiGenerating(true);
    try {
      const suggestion = await suggestTask(mockResource, project);
      setTitle(suggestion.title);
      setDescription(suggestion.description);
      setPriority(suggestion.priority);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrors({ title: 'Title is required' });
      return;
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      epicId: epicId || undefined,
      title,
      description,
      status: 'Todo',
      priority,
      assigneeId: assigneeId || undefined,
      estimatedHours,
      tags: epicId ? [project.delivery?.epics.find(e => e.id === epicId)?.title || 'Task'] : ['Task']
    };

    onAdd(newTask);
    onClose();
    // Reset
    setTitle('');
    setDescription('');
    setEpicId('');
    setAssigneeId('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Task</h2>
              <p className="text-sm text-slate-500 font-medium">Add a technical requirement to the backlog.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* AI Suggestion Trigger */}
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isAiGenerating}
            className="w-full py-4 bg-blue-50 text-blue-700 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-100 transition-all border border-blue-100 shadow-sm group"
          >
            {isAiGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
            {isAiGenerating ? 'Linkare AI is drafting...' : 'Generate Task with Linkare AI'}
          </button>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
              placeholder="e.g. Implement JWT Authentication"
              className={`w-full px-5 py-4 rounded-2xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold`}
            />
            {errors.title && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Target size={16} className="text-slate-400" /> Related Epic
              </label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">No Epic</option>
                {project.delivery?.epics.map(epic => (
                  <option key={epic.id} value={epic.id}>{epic.title}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Users size={16} className="text-slate-400" /> Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Unassigned</option>
                {project.squad?.map(member => (
                  <option key={member.role} value={member.role}>{member.role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Flag size={16} className="text-slate-400" /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Estimate (Hours)
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Technical details, acceptance criteria..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-blue-50 outline-none transition-all leading-relaxed"
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
            Add to Backlog
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
