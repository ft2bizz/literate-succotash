
import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Sparkles, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Project, Epic } from '../types';
import { suggestEpic } from '../services/geminiService';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAdd: (epic: Epic) => void;
}

const CreateEpicModal: React.FC<CreateEpicModalProps> = ({ isOpen, onClose, project, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAiSuggest = async () => {
    setIsAiGenerating(true);
    try {
      const suggestion = await suggestEpic(project);
      setTitle(suggestion.title || '');
      setDescription(suggestion.description || '');
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

    const newEpic: Epic = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status: 'Planned'
    };

    onAdd(newEpic);
    onClose();
    // Reset
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Epic</h2>
              <p className="text-sm text-slate-500 font-medium">Define a high-level project initiative.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* AI Suggestion Trigger */}
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={isAiGenerating}
            className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm group"
          >
            {isAiGenerating ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />}
            {isAiGenerating ? 'Linkare AI is thinking...' : 'Suggest Epic with Linkare AI'}
          </button>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Epic Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({}); }}
              placeholder="e.g. User Authentication System"
              className={`w-full px-5 py-4 rounded-2xl border ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50/50'} focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold`}
            />
            {errors.title && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="High-level goals and scope of this epic..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-4 focus:ring-indigo-50 outline-none transition-all leading-relaxed"
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
            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={18} />
            Create Epic
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEpicModal;
