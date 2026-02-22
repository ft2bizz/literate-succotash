
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  Download,
  BarChart3,
  Loader2,
  XCircle,
  BrainCircuit
} from 'lucide-react';
import { MOCK_RESOURCES, ALLOCATION_STATS, MOCK_PROJECTS } from '../constants';
import { Resource } from '../types';
import { scoutResources, ScoutResult } from '../services/geminiService';
import ResourceProfileDrawer from '../components/ResourceProfileDrawer';
import AddResourceModal from '../components/AddResourceModal';
import AssignTaskModal from '../components/AssignTaskModal';

const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [availabilityFilter, setAvailabilityFilter] = useState('All Status');
  const [aiQuery, setAiQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiResults, setAiResults] = useState<ScoutResult[] | null>(null);
  const [selectedResource, setSelectedResource] = useState<(Resource & { aiReasoning?: string; aiScore?: number }) | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Assign Task State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [resourceToAssign, setResourceToAssign] = useState<Resource | null>(null);

  const roles = ['All Roles', ...new Set(resources.map(r => r.role))];
  const statuses = ['All Status', 'Available', 'Busy', 'Partially Available'];

  const filteredResources = useMemo(() => {
    if (aiResults) {
      return aiResults
        .map(result => {
          const resource = resources.find(r => r.id === result.resourceId);
          return resource ? { ...resource, aiReasoning: result.reasoning, aiScore: result.matchScore } : null;
        })
        .filter((r): r is (Resource & { aiReasoning: string; aiScore: number }) => r !== null);
    }

    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           resource.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === 'All Roles' || resource.role === roleFilter;
      const matchesAvailability = availabilityFilter === 'All Status' || resource.availability === availabilityFilter;
      return matchesSearch && matchesRole && matchesAvailability;
    });
  }, [searchTerm, roleFilter, availabilityFilter, aiResults, resources]);

  const handleAiSearch = async () => {
    if (!aiQuery) return;
    setIsAiSearching(true);
    try {
      const results = await scoutResources(aiQuery, resources);
      setAiResults(results);
    } catch (error) {
      console.error("AI Scout Error:", error);
    } finally {
      setIsAiSearching(false);
    }
  };

  const clearAiSearch = () => {
    setAiResults(null);
    setAiQuery('');
  };

  const handleAddResource = (newResource: Resource) => {
    setResources(prev => [newResource, ...prev]);
  };

  const handleAssignTask = (task: any) => {
    console.log("Task Assigned:", task);
    // In a real app, we would update the backend or local state
    alert(`Task "${task.title}" assigned to ${resourceToAssign?.name} successfully!`);
  };

  const openAssignModal = (resource: Resource) => {
    setResourceToAssign(resource);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resource Directory</h2>
          <p className="text-slate-500 mt-1 font-medium">Manage and optimize your company's talent pool.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
          >
            <UserPlus size={18} />
            Add Resource
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 size={20} />
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
              <CheckCircle2 size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.onBench}</div>
          <p className="text-xs text-green-600 mt-1 font-bold">Ready for assignment</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partially Allocated</span>
          </div>
          <div className="text-3xl font-black text-slate-900">14</div>
          <p className="text-xs text-amber-600 mt-1 font-bold">Mixed availability</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Over-capacity</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{ALLOCATION_STATS.overAllocated}</div>
          <p className="text-xs text-red-600 mt-1 font-bold">Burnout risk</p>
        </div>
      </div>

      {/* AI Smart Search Section */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">AI Talent Scout</h3>
                <p className="text-slate-400 text-sm font-medium">Describe the project needs to find the perfect match.</p>
              </div>
            </div>
            {aiResults && (
              <button 
                onClick={clearAiSearch}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <XCircle size={16} />
                Clear AI Filter
              </button>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                placeholder="e.g. 'I need a senior frontend dev with React experience for a 3-month fintech project'"
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button 
              onClick={handleAiSearch}
              disabled={isAiSearching || !aiQuery}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isAiSearching ? <Loader2 size={20} className="animate-spin" /> : <BrainCircuit size={20} />}
              {isAiSearching ? 'Scouting...' : 'Find Matches'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      {!aiResults && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center animate-in fade-in duration-300">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, skill, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50/50"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full md:w-48 appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600 cursor-pointer"
              >
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
            <div className="relative flex-1 md:flex-none">
              <select 
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full md:w-48 appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-600 cursor-pointer"
              >
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      )}

      {/* AI Mode Banner */}
      {aiResults && (
        <div className="flex items-center justify-between px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 text-blue-700">
            <Sparkles size={18} />
            <span className="text-sm font-bold">Showing top {filteredResources.length} AI-matched resources for your query.</span>
          </div>
          <button 
            onClick={clearAiSearch}
            className="text-xs font-black uppercase tracking-widest text-blue-600 hover:underline"
          >
            Reset View
          </button>
        </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const isAiMatch = 'aiReasoning' in resource;
          
          return (
            <div key={resource.id} className={`bg-white rounded-[2rem] border transition-all group overflow-hidden ${
              isAiMatch ? 'border-blue-200 shadow-xl ring-2 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }`}>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden ring-4 ring-slate-50 shadow-inner">
                      <img src={`https://picsum.photos/seed/${resource.id}/80/80`} alt={resource.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${
                      resource.availability === 'Available' ? 'bg-green-500' : 
                      resource.availability === 'Busy' ? 'bg-red-500' : 'bg-amber-500'
                    }`}>
                      {resource.availability === 'Available' && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </div>
                  {isAiMatch && (
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-blue-200">
                      <Sparkles size={10} /> {resource.aiScore}% Match
                    </div>
                  )}
                  {!isAiMatch && (
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{resource.name}</h4>
                  <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mt-1">{resource.role}</p>
                </div>

                {isAiMatch && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md">
                      <BrainCircuit size={14} />
                    </div>
                    <p className="text-xs text-blue-800 font-medium leading-relaxed italic">
                      "{resource.aiReasoning}"
                    </p>
                  </div>
                )}

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="text-slate-300" />
                    {resource.location}
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                    <Mail size={16} className="text-slate-300" />
                    {resource.email}
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Current Allocation</span>
                    <span className={resource.allocationPercentage! > 100 ? 'text-red-500' : 'text-slate-600'}>
                      {resource.allocationPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        resource.allocationPercentage! > 100 ? 'bg-red-500' : 
                        resource.allocationPercentage! > 80 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(resource.allocationPercentage!, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {resource.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-tighter rounded-lg border border-slate-100">
                      {skill}
                    </span>
                  ))}
                  {resource.skills.length > 4 && <span className="text-[10px] text-slate-400 font-bold">+{resource.skills.length - 4}</span>}
                </div>
              </div>
              
              <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-50 flex gap-3">
                <button 
                  onClick={() => setSelectedResource(resource)}
                  className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => openAssignModal(resource)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  Assign Task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No resources found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Profile Drawer */}
      <ResourceProfileDrawer 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />

      {/* Add Resource Modal */}
      <AddResourceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddResource} 
      />

      {/* Assign Task Modal */}
      <AssignTaskModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        resource={resourceToAssign}
        projects={MOCK_PROJECTS}
        onAssign={handleAssignTask}
      />
    </div>
  );
};

export default Resources;
