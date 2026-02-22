
import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  BrainCircuit
} from 'lucide-react';
import { Resource } from '../types';

interface ResourceProfileDrawerProps {
  resource: (Resource & { aiReasoning?: string; aiScore?: number }) | null;
  onClose: () => void;
}

const ResourceProfileDrawer: React.FC<ResourceProfileDrawerProps> = ({ resource, onClose }) => {
  if (!resource) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-sm">
              <img src={`https://picsum.photos/seed/${resource.id}/48/48`} alt={resource.name} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{resource.name}</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{resource.role}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* AI Match Context (if applicable) */}
          {resource.aiReasoning && (
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={20} />
                    <span className="font-black uppercase tracking-widest text-xs">AI Scout Match</span>
                  </div>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                    {resource.aiScore}% Match
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-medium italic">
                  "{resource.aiReasoning}"
                </p>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Experience</div>
              <div className="text-lg font-black text-slate-900">{resource.experienceLevel}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Allocation</div>
              <div className="text-lg font-black text-slate-900">{resource.allocationPercentage}%</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Status</div>
              <div className={`text-sm font-black uppercase tracking-widest mt-1 ${
                resource.availability === 'Available' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {resource.availability}
              </div>
            </div>
          </div>

          {/* Bio */}
          <section>
            <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <BrainCircuit size={18} className="text-blue-600" />
              Professional Summary
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">{resource.bio}</p>
          </section>

          {/* Contact & Info */}
          <section className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">Contact</h3>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <Mail size={16} className="text-slate-400" />
                {resource.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <Phone size={16} className="text-slate-400" />
                {resource.phone}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <MapPin size={16} className="text-slate-400" />
                {resource.location}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-widest">Details</h3>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <Calendar size={16} className="text-slate-400" />
                Joined {new Date(resource.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <Briefcase size={16} className="text-slate-400" />
                {resource.projectHistory.length} Projects Completed
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Technical Stack</h3>
            <div className="flex flex-wrap gap-2">
              {resource.skills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-tighter rounded-xl border border-slate-100">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              Certifications
            </h3>
            <div className="space-y-3">
              {resource.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-amber-50/30 border border-amber-100 rounded-2xl">
                  <CheckCircle2 size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-slate-700">{cert}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Project History */}
          <section>
            <h3 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Project History</h3>
            <div className="space-y-4">
              {resource.projectHistory.map((project, i) => (
                <div key={i} className="p-6 border border-slate-100 rounded-[2rem] hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-black text-slate-900">{project.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.period}</span>
                  </div>
                  <div className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wider">{project.role}</div>
                  <p className="text-sm text-slate-500 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 flex gap-3">
          <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            Assign to Project
          </button>
          <button className="px-6 py-4 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 transition-all">
            Download CV
          </button>
        </div>
      </div>
    </>
  );
};

export default ResourceProfileDrawer;
