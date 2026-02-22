
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  FileText, 
  Target, 
  Users, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Download,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PRD, Project } from '../types';
import { MOCK_PROJECTS } from '../constants';

interface PRDDrawerProps {
  prd: PRD | null;
  projectName: string;
  projectId: string;
  onClose: () => void;
}

const PRDDrawer: React.FC<PRDDrawerProps> = ({ prd, projectName, projectId, onClose }) => {
  const navigate = useNavigate();
  if (!prd) return null;

  const handleApprove = () => {
    // Persist the PRD to the project in localStorage
    const localProjects: Project[] = JSON.parse(localStorage.getItem('linkare_projects') || '[]');
    const mockProjects: Project[] = MOCK_PROJECTS;
    const allProjects = [...mockProjects, ...localProjects];
    
    const projectIndex = allProjects.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      const updatedProject = { ...allProjects[projectIndex], prd };
      
      // If it was a mock project, we save it as a "local" override
      const updatedLocalProjects = localProjects.some(p => p.id === projectId)
        ? localProjects.map(p => p.id === projectId ? updatedProject : p)
        : [updatedProject, ...localProjects];
        
      localStorage.setItem('linkare_projects', JSON.stringify(updatedLocalProjects));
    }

    navigate(`/delivery/${projectId}`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-[70] overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Requirements Document</h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Download size={20} />
            </button>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-12 space-y-16 max-w-3xl mx-auto">
          {/* AI Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
            <Sparkles size={14} /> AI Generated Document
          </div>

          {/* Introduction */}
          <section className="space-y-6">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              1. Introduction
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              {prd.introduction}
            </p>
          </section>

          {/* Strategic Goals */}
          <section className="space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              2. Strategic Goals
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {prd.goals.map((goal, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <Target size={18} className="text-blue-600" />
                  </div>
                  <p className="text-slate-700 font-bold leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </section>

          {/* User Personas */}
          <section className="space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              3. User Personas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prd.userPersonas.map((persona, i) => (
                <div key={i} className="p-8 border border-slate-100 rounded-[2.5rem] space-y-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                      <Users size={24} className="text-slate-600" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{persona.name}</h4>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{persona.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium italic">"{persona.needs}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* Functional Requirements */}
          <section className="space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              4. Functional Requirements
            </h3>
            <div className="overflow-hidden border border-slate-100 rounded-[2.5rem]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feature</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {prd.functionalRequirements.map((req, i) => (
                    <tr key={i}>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{req.feature}</div>
                        <div className="text-sm text-slate-500 mt-1">{req.description}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                          req.priority === 'High' ? 'bg-red-50 text-red-600' : 
                          req.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Technical Stack */}
          <section className="space-y-8">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              5. Technical Stack
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {prd.technicalStack.map((tech, i) => (
                <div key={i} className="p-6 bg-slate-900 text-white rounded-[2rem] flex items-center justify-between group hover:bg-blue-600 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                      <Layers size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60">{tech.layer}</div>
                      <div className="text-lg font-black">{tech.technology}</div>
                    </div>
                  </div>
                  <div className="max-w-xs text-right text-xs text-slate-400 group-hover:text-white/80 font-medium">
                    {tech.reasoning}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Development Instructions */}
          <section className="space-y-8 pb-20">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-1 h-8 bg-blue-600 rounded-full" />
              6. Development Instructions
            </h3>
            <div className="space-y-4">
              {prd.developmentInstructions.map((instruction, i) => (
                <div key={i} className="flex gap-6 items-start p-8 border border-slate-100 rounded-[2.5rem] hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black shrink-0">
                    {i + 1}
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed">{instruction}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 flex gap-4">
          <button 
            onClick={handleApprove}
            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
          >
            Approve & Start Development
            <ArrowRight size={16} />
          </button>
          <button className="px-8 py-4 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 transition-all">
            Share with Team
          </button>
        </div>
      </div>
    </>
  );
};

export default PRDDrawer;
