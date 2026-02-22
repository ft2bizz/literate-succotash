
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal,
  Users,
  Activity,
  BarChart3,
  UserCheck,
  UserX,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_RESOURCES, ALLOCATION_STATS } from '../constants';
import { Project, KPIType, Resource } from '../types';
import { StatusBadge, HealthIndicator } from '../components/ProjectShared';
import { ProjectDetailsDrawer } from '../components/ProjectDetailsDrawer';
import KPIDetailsDrawer from '../components/KPIDetailsDrawer';
import AllocateResourceModal from '../components/AllocateResourceModal';

const Dashboard: React.FC = () => {
  const [localProjects, setLocalProjects] = useState<Project[]>(() => {
    return JSON.parse(localStorage.getItem('linkare_projects') || '[]');
  });
  
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const projects = useMemo(() => [...MOCK_PROJECTS, ...localProjects], [localProjects]);
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedKPI, setSelectedKPI] = useState<KPIType | null>(null);
  
  // Allocation State
  const [selectedResourceForAllocation, setSelectedResourceForAllocation] = useState<Resource | null>(null);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);

  const handleUpdateProject = (updatedProject: Project) => {
    const isLocal = localProjects.some(p => p.id === updatedProject.id);
    if (isLocal) {
      const updatedLocal = localProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
      setLocalProjects(updatedLocal);
      localStorage.setItem('linkare_projects', JSON.stringify(updatedLocal));
    }
    setSelectedProject(updatedProject);
  };

  const handleAllocateResource = (resourceId: string, projectId: string, percentage: number) => {
    setResources(prev => prev.map(r => {
      if (r.id === resourceId) {
        const newAlloc = (r.allocationPercentage || 0) + percentage;
        return {
          ...r,
          allocationPercentage: newAlloc,
          availability: newAlloc >= 100 ? 'Busy' : newAlloc > 0 ? 'Partially Available' : 'Available'
        };
      }
      return r;
    }));
    
    // In a real app, we would also update the project's squad/matches
    alert(`Resource allocated successfully!`);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Linkare Command Center</h2>
          <p className="text-slate-500 mt-1 font-medium">Real-time intelligence for your IT project portfolio.</p>
        </div>
        <Link 
          to="/new-project" 
          className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {/* Top Stats - Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <button 
          onClick={() => setSelectedKPI('progress')}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <TrendingUp size={24} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900">84%</div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Avg. Progress</div>
        </button>

        <button 
          onClick={() => setSelectedKPI('completed')}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <CheckCircle2 size={24} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-green-600 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900">12</div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Completed</div>
        </button>

        <button 
          onClick={() => setSelectedKPI('budget')}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <DollarSign size={24} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-600 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900">$1.2M</div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Budget Managed</div>
        </button>

        <button 
          onClick={() => setSelectedKPI('risk')}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
              <AlertCircle size={24} />
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-red-600 transition-colors" />
          </div>
          <div className="text-3xl font-black text-slate-900">2</div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">At Risk</div>
        </button>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900">Active Projects Portfolio</h3>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">Filter</button>
            <button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{project.title}</div>
                    <div className="text-xs text-slate-400 font-medium mt-1">{project.industry} • {project.id}</div>
                  </td>
                  <td className="px-8 py-6">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-8 py-6">
                    <HealthIndicator health={project.health} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden min-w-[100px]">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-1000" 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-black text-slate-700">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-slate-900">{project.budgetUtilization}%</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Utilized</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resource Allocation Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Resource Allocation & Utilization</h3>
              <p className="text-slate-500 font-medium">Monitor squad capacity and bench status across the company.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={14} /> Real-time Data
            </div>
          </div>
        </div>

        {/* Allocation KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
                <Users size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Staff</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.totalResources}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Active employees</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Activity size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilization</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.averageUtilization}%</div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${ALLOCATION_STATS.averageUtilization}%` }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <UserCheck size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">On Bench</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.onBench}</div>
            <p className="text-xs text-green-600 mt-1 font-bold">Available for projects</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <UserX size={20} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Over-allocated</span>
            </div>
            <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.overAllocated}</div>
            <p className="text-xs text-red-600 mt-1 font-bold">Burnout risk detected</p>
          </div>
        </div>

        {/* Resource Status Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h4 className="text-lg font-black text-slate-900">Resource Availability Matrix</h4>
            <Link to="/resources" className="text-blue-600 text-sm font-bold hover:underline">Manage Resources</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {resources.slice(0, 6).map((resource) => (
                  <tr 
                    key={resource.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                    onClick={() => { setSelectedResourceForAllocation(resource); setIsAllocateModalOpen(true); }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
                          <img src={`https://picsum.photos/seed/${resource.id}/40/40`} alt={resource.name} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{resource.name}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{resource.experienceLevel}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm font-medium text-slate-600">{resource.role}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        resource.availability === 'Available' ? 'bg-green-50 text-green-600' : 
                        resource.availability === 'Busy' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {resource.availability}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[60px]">
                          <div 
                            className={`h-full rounded-full ${resource.allocationPercentage! > 100 ? 'bg-red-500' : 'bg-blue-600'}`} 
                            style={{ width: `${Math.min(resource.allocationPercentage!, 100)}%` }}
                          />
                        </div>
                        <span className={`text-xs font-black ${resource.allocationPercentage! > 100 ? 'text-red-600' : 'text-slate-700'}`}>
                          {resource.allocationPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedResourceForAllocation(resource); setIsAllocateModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all border border-slate-100"
                      >
                        <UserPlus size={14} />
                        Allocate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/30 border-t border-slate-50 text-center">
            <Link to="/resources" className="text-sm font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">View Full Resource Directory</Link>
          </div>
        </div>
      </div>

      {/* Project Details Drawer */}
      <ProjectDetailsDrawer 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
        onUpdate={handleUpdateProject}
      />

      {/* KPI Details Drawer */}
      <KPIDetailsDrawer 
        type={selectedKPI} 
        projects={projects} 
        onClose={() => setSelectedKPI(null)} 
      />

      {/* Allocate Resource Modal */}
      <AllocateResourceModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        resource={selectedResourceForAllocation}
        projects={projects}
        onAllocate={handleAllocateResource}
      />
    </div>
  );
};

export default Dashboard;
