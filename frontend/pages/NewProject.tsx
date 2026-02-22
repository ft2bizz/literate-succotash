
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Users, 
  Search, 
  CheckCircle, 
  Loader2, 
  ChevronRight, 
  AlertTriangle, 
  Target, 
  Package, 
  ShieldAlert, 
  CalendarDays,
  ArrowLeft,
  Zap,
  DollarSign,
  Calendar,
  Trophy,
  ArrowRight,
  LayoutDashboard,
  Briefcase
} from 'lucide-react';
import { ProjectData, ProjectScope, SquadRole, ResourceMatch, Project } from '../types';
import { generateProjectScope, suggestSquadComposition, matchResources } from '../services/geminiService';
import { MOCK_RESOURCES } from '../constants';

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectData>({
    title: '',
    description: '',
    duration: '3 months',
    industry: 'Technology',
    value: '',
    estimatedStartDate: ''
  });

  const [scope, setScope] = useState<ProjectScope | null>(null);
  const [squad, setSquad] = useState<SquadRole[] | null>(null);
  const [matches, setMatches] = useState<ResourceMatch[] | null>(null);
  const [finalProject, setFinalProject] = useState<Project | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateScope = async () => {
    if (!project.title || !project.description) return;
    setLoading('scope');
    try {
      const result = await generateProjectScope(project);
      setScope(result);
      setStep(2);
    } catch (error) {
      console.error("Error generating scope:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleSuggestSquad = async () => {
    setLoading('squad');
    try {
      const result = await suggestSquadComposition(project);
      setSquad(result);
      setStep(3);
    } catch (error) {
      console.error("Error suggesting squad:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleMatchResources = async () => {
    if (!squad) return;
    setLoading('matching');
    try {
      const result = await matchResources(project, squad, MOCK_RESOURCES);
      setMatches(result);
      setStep(4);
    } catch (error) {
      console.error("Error matching resources:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleFinalize = async () => {
    setLoading('finalize');
    
    // Simulate API call to save project
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newProject: Project = {
      ...project,
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active',
      progress: 0,
      budgetUtilization: 0,
      health: 'On Track',
      startDate: project.estimatedStartDate || new Date().toISOString().split('T')[0],
      endDate: 'TBD',
      scope: scope || undefined,
      squad: squad || undefined,
      matches: matches || undefined,
      plData: {
        revenue: parseFloat(project.value?.replace(/[^0-9.]/g, '') || '0'),
        laborCosts: 0,
        cloudCosts: 0,
        licenseCosts: 0,
        grossProfit: 0,
        marginPercentage: 0,
        burnRate: 0,
        aiSuggestions: ["Initial setup complete. Monitor resource allocation to optimize margin."]
      }
    };

    // Persist to localStorage
    const existingProjects = JSON.parse(localStorage.getItem('linkare_projects') || '[]');
    localStorage.setItem('linkare_projects', JSON.stringify([newProject, ...existingProjects]));

    setFinalProject(newProject);
    setStep(5);
    setLoading(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Stepper */}
      {step < 5 && (
        <div className="flex items-center justify-center gap-4 px-4 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 shadow-sm ${
                  step === s ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-100' : 
                  step > s ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-200'
                }`}>
                  {step > s ? <CheckCircle size={24} /> : s}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s === 1 ? 'Info' : s === 2 ? 'Scope' : s === 3 ? 'Squad' : 'Match'}
                </span>
              </div>
              {s < 4 && (
                <div className={`w-16 h-0.5 rounded-full transition-colors duration-500 ${step > s ? 'bg-green-500' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Step 1: Project Info */}
      {step === 1 && (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Project Definition</h3>
              <p className="text-slate-500 text-sm">Provide the core details for Linkare AI to analyze.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Project Title</label>
              <input
                type="text"
                name="title"
                value={project.title}
                onChange={handleInputChange}
                placeholder="e.g. Cloud Migration Strategy 2024"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-lg font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Detailed Description</label>
              <textarea
                name="description"
                value={project.description}
                onChange={handleInputChange}
                rows={5}
                placeholder="What are we building? What is the business value? Mention specific technologies if known..."
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all leading-relaxed"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <DollarSign size={16} className="text-slate-400" /> Project Value (USD)
                </label>
                <input
                  type="text"
                  name="value"
                  value={project.value}
                  onChange={handleInputChange}
                  placeholder="e.g. 150,000"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" /> Estimated Start Date
                </label>
                <input
                  type="date"
                  name="estimatedStartDate"
                  value={project.estimatedStartDate}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Estimated Duration</label>
                <select
                  name="duration"
                  value={project.duration}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                >
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Industry / Sector</label>
                <input
                  type="text"
                  name="industry"
                  value={project.industry}
                  onChange={handleInputChange}
                  placeholder="e.g. Fintech, Healthcare..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={handleGenerateScope}
            disabled={loading === 'scope' || !project.title || !project.description}
            className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-slate-200 group"
          >
            {loading === 'scope' ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                Generate AI Project Scope
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 2: AI Scope */}
      {step === 2 && scope && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">AI Strategic Scope</h3>
                <p className="text-slate-500 font-medium">Linkare AI has analyzed your project requirements.</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Analysis Complete
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Objectives Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">Core Objectives</h4>
              </div>
              <div className="space-y-4">
                {scope.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">{obj}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">Key Deliverables</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {scope.deliverables.map((del, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 border border-slate-100 rounded-2xl hover:bg-green-50/30 transition-colors">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-slate-700 text-sm font-semibold">{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldAlert size={24} />
                  </div>
                <h4 className="text-xl font-bold text-slate-800">Risk Assessment</h4>
              </div>
              <div className="space-y-3">
                {scope.risks.map((risk, i) => (
                  <div key={i} className="p-4 bg-red-50/50 border border-red-100 rounded-2xl flex gap-3 items-center">
                    <AlertTriangle size={16} className="text-red-500 shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{risk}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarDays size={24} />
                </div>
                <h4 className="text-xl font-bold text-slate-800">Project Roadmap</h4>
              </div>
              <div className="relative pl-4 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {scope.timeline.map((t, i) => (
                  <div key={i} className="relative pl-8">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white" />
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-black text-slate-900">{t.phase}</div>
                        <div className="text-xs text-slate-500 font-medium mt-0.5">Estimated Phase</div>
                      </div>
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-wider">
                        {t.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Refine Input
            </button>
            <button
              onClick={handleSuggestSquad}
              disabled={loading === 'squad'}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200"
            >
              {loading === 'squad' ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Users size={20} />
                  Suggest Squad Composition
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Squad Suggestion */}
      {step === 3 && squad && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Recommended Squad</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {squad.map((role, i) => (
                <div key={i} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 flex items-start gap-6 hover:bg-white hover:shadow-md transition-all">
                  <div className="w-14 h-14 bg-white border border-slate-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <Users size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">{role.role}</h4>
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-full">x{role.count}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{role.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleMatchResources}
            disabled={loading === 'matching'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200"
          >
            {loading === 'matching' ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Match Company Resources
          </button>
        </div>
      )}

      {/* Step 4: Resource Matching */}
      {step === 4 && matches && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Search size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Resource Matching Results</h3>
            </div>
            <div className="space-y-6">
              {matches.map((match, i) => (
                <div key={i} className="border border-slate-100 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-black text-slate-700 uppercase tracking-wider text-xs">{match.role}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-500 font-black uppercase">Match Score</span>
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${match.matchScore > 80 ? 'bg-green-500' : match.matchScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-900">{match.matchScore}%</span>
                    </div>
                  </div>
                  <div className="p-8 flex items-start gap-8">
                    {match.suggestedResource ? (
                      <>
                        <div className="w-20 h-20 rounded-3xl bg-slate-200 overflow-hidden shrink-0 ring-4 ring-slate-50 shadow-inner">
                          <img src={`https://picsum.photos/seed/${match.suggestedResource.id}/80/80`} alt={match.suggestedResource.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-slate-900">{match.suggestedResource.name}</h4>
                            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                              match.suggestedResource.availability === 'Available' ? 'bg-green-100 text-green-700' : 
                              match.suggestedResource.availability === 'Busy' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {match.suggestedResource.availability}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {match.suggestedResource.skills.map(s => (
                              <span key={s} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100">{s}</span>
                            ))}
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-600 leading-relaxed">
                            "{match.matchReason}"
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-6 text-slate-400 py-6 w-full justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <AlertTriangle size={40} className="text-slate-300" />
                        <div>
                          <p className="font-black text-slate-500 uppercase tracking-wider">No direct match found</p>
                          <p className="text-sm font-medium">Consider external hiring or training for this role.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-white border border-slate-200 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              Start Over
            </button>
            <button
              onClick={handleFinalize}
              disabled={loading === 'finalize'}
              className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200"
            >
              {loading === 'finalize' ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <CheckCircle size={20} />
                  Finalize Project Setup
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success View */}
      {step === 5 && finalProject && (
        <div className="max-w-3xl mx-auto text-center space-y-10 animate-in zoom-in-95 duration-700 py-12">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-100/50">
              <Trophy size={64} />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Project Successfully Launched!</h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto">
              Linkare AI has initialized <span className="text-blue-600 font-bold">"{finalProject.title}"</span>. 
              The scope is defined, the squad is suggested, and resources are matched.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project ID</div>
              <div className="text-lg font-black text-slate-900">{finalProject.id}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Date</div>
              <div className="text-lg font-black text-slate-900">{finalProject.startDate}</div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget Value</div>
              <div className="text-lg font-black text-slate-900">${finalProject.value}</div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="px-8 py-5 bg-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <LayoutDashboard size={20} />
              Go to Dashboard
            </Link>
            <Link 
              to="/projects"
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 group"
            >
              <Briefcase size={20} />
              View in Portfolio
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewProject;
