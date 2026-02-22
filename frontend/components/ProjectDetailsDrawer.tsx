
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  DollarSign, 
  Activity, 
  Calendar, 
  Target, 
  ShieldAlert, 
  Users,
  FileText,
  Sparkles,
  Loader2,
  Edit3,
  Zap,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { Project, PRD } from '../types';
import { StatusBadge, HealthIndicator } from './ProjectShared';
import { PLView } from './PLView';
import { generateProjectPRD } from '../services/geminiService';
import PRDDrawer from './PRDDrawer';
import EditProjectModal from './EditProjectModal';

interface ProjectDetailsDrawerProps {
  project: Project | null;
  onClose: () => void;
  onUpdate?: (updatedProject: Project) => void;
}

export const ProjectDetailsDrawer: React.FC<ProjectDetailsDrawerProps> = ({ project, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'pl'>('overview');
  const [isGeneratingPRD, setIsGeneratingPRD] = useState(false);
  const [showPRD, setShowPRD] = useState(false);
  const [currentPRD, setCurrentPRD] = useState<PRD | null>(project?.prd || null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!project) return null;

  const handleGeneratePRD = async () => {
    if (currentPRD) {
      setShowPRD(true);
      return;
    }

    setIsGeneratingPRD(true);
    try {
      const prd = await generateProjectPRD(project);
      setCurrentPRD(prd);
      setShowPRD(true);
    } catch (error) {
      console.error("Error generating PRD:", error);
    } finally {
      setIsGeneratingPRD(false);
    }
  };

  const handleSaveEdit = (updatedProject: Project) => {
    if (onUpdate) {
      onUpdate(updatedProject);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="sticky top-0 bg-white border-b border-slate-100 p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
              <Activity size={28} className="text-slate-400" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{project.title}</h2>
                <StatusBadge status={project.status} />
              </div>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Project ID: {project.id}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="px-8 border-b border-slate-100 flex gap-8">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`py-5 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('pl')}
            className={`py-5 text-sm font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'pl' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <DollarSign size={16} />
            P&L Analysis
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Actions Section - NEW DESIGN */}
          <section className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Settings2 size={16} className="text-slate-400" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate(`/delivery/${project.id}`)}
                className="flex flex-col items-start gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:border-blue-600 hover:shadow-lg hover:shadow-blue-50 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900">Delivery Center</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Manage Execution</div>
                </div>
              </button>

              <button 
                onClick={handleGeneratePRD}
                disabled={isGeneratingPRD}
                className="flex flex-col items-start gap-3 p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-50 transition-all group disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {isGeneratingPRD ? <Loader2 size={20} className="animate-spin" /> : <FileText size={20} />}
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900">{currentPRD ? 'View PRD' : 'Generate PRD'}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">AI Requirements</div>
                </div>
              </button>
            </div>
          </section>

          {activeTab === 'overview' ? (
            <div className="space-y-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Progress</div>
                  <div className="text-xl font-black text-slate-900">{project.progress}%</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Budget</div>
                  <div className="text-xl font-black text-slate-900">{project.budgetUtilization}%</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${project.budgetUtilization}%` }} />
                  </div>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Health</div>
                  <div className="mt-1"><HealthIndicator health={project.health} /></div>
                </div>
              </div>

              <section>
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Activity size={18} className="text-blue-600" />
                  Project Overview
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">{project.description}</p>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Calendar size={20} className="text-slate-400" />
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</div>
                      <div className="text-sm font-bold text-slate-900">{project.startDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Calendar size={20} className="text-slate-400" />
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Date</div>
                      <div className="text-sm font-bold text-slate-900">{project.endDate}</div>
                    </div>
                  </div>
                </div>
              </section>

              {project.scope && (
                <section className="space-y-6">
                  <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                    <Target size={18} className="text-blue-600" />
                    AI Generated Scope
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objectives</h4>
                      <ul className="space-y-3">
                        {project.scope.objectives.map((obj, i) => (
                          <li key={i} className="text-sm text-slate-600 font-medium flex gap-3">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" /> {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deliverables</h4>
                      <ul className="space-y-3">
                        {project.scope.deliverables.map((del, i) => (
                          <li key={i} className="text-sm text-slate-600 font-medium flex gap-3">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 shrink-0" /> {del}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}
            </div>
          ) : (
            <PLView project={project} />
          )}
        </div>
        
        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-8 flex gap-4">
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <Edit3 size={18} />
            Edit Details
          </button>
          <button className="px-8 py-4 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-600 hover:bg-slate-50 transition-all">
            Archive
          </button>
        </div>
      </div>

      <PRDDrawer 
        prd={currentPRD} 
        projectName={project.title} 
        projectId={project.id}
        onClose={() => setShowPRD(false)} 
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={handleSaveEdit}
      />
    </>
  );
};
