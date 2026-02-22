
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  LayoutGrid, 
  List, 
  ChevronDown, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  Calendar,
  Target,
  Activity,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { MOCK_PROJECTS } from '../constants';
import { Project, ProjectStatus } from '../types';
import { StatusBadge, HealthIndicator } from '../components/ProjectShared';
import { ProjectDetailsDrawer } from '../components/ProjectDetailsDrawer';
import { generatePortfolioSummary } from '../services/geminiService';
import { Link } from 'react-router-dom';

const MyProjects: React.FC = () => {
  const [localProjects, setLocalProjects] = useState<Project[]>(() => {
    return JSON.parse(localStorage.getItem('linkare_projects') || '[]');
  });
  
  const projects = useMemo(() => [...MOCK_PROJECTS, ...localProjects], [localProjects]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, projects]);

  const statusData = useMemo(() => {
    const counts = projects.reduce((acc: any, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(name => ({ name, value: counts[name] }));
  }, [projects]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    try {
      const summary = await generatePortfolioSummary(projects);
      setAiSummary(summary);
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleUpdateProject = (updatedProject: Project) => {
    const isLocal = localProjects.some(p => p.id === updatedProject.id);
    if (isLocal) {
      const updatedLocal = localProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
      setLocalProjects(updatedLocal);
      localStorage.setItem('linkare_projects', JSON.stringify(updatedLocal));
    }
    setSelectedProject(updatedProject);
  };

  useEffect(() => {
    handleGenerateSummary();
  }, []);

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Project Portfolio</h2>
          <p className="text-slate-500 mt-1 font-medium">Strategic overview of all active and planned initiatives.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
          </div>
          <Link 
            to="/new-project"
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            <Plus size={18} />
            New Project
          </Link>
        </div>
      </div>

      {/* Portfolio Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 shrink-0">
              <Sparkles size={40} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-black tracking-tight">Portfolio Intelligence</h3>
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-widest">Live Analysis</div>
              </div>
              {isSummarizing ? (
                <div className="flex items-center gap-3 text-slate-400">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm font-medium">Synthesizing portfolio health...</span>
                </div>
              ) : (
                <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                  "{aiSummary || "No summary available. Click refresh to analyze your portfolio."}"
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <PieChartIcon size={20} />
            </div>
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Status Distribution</h4>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search projects by name or industry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/50"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full md:w-48 appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-600 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="At Risk">At Risk</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Project Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="p-10 flex-1">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Activity size={28} />
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="mb-8">
                  <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{project.title}</h4>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{project.industry} • {project.id}</p>
                </div>

                <div className="space-y-8 mb-4">
                  <div className="flex justify-between items-center">
                    <HealthIndicator health={project.health} />
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-tighter">
                      <Calendar size={14} />
                      {project.duration}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Completion Progress</span>
                      <span className="text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-2xl border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://picsum.photos/seed/user${i + (project.id.length)}/40/40`} alt="Team" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-2xl border-4 border-white bg-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                    +2
                  </div>
                </div>
                <button className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProjects.map((project) => (
                <tr 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                >
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors text-lg">{project.title}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">{project.industry}</div>
                  </td>
                  <td className="px-10 py-8">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-10 py-8">
                    <HealthIndicator health={project.health} />
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[120px]">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-sm font-black text-slate-700">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-sm font-black text-slate-900">{project.duration}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Estimated</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
            <Target size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No projects found</h3>
          <p className="text-slate-500 mt-2 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}

      <ProjectDetailsDrawer 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onUpdate={handleUpdateProject}
      />
    </div>
  );
};

export default MyProjects;
