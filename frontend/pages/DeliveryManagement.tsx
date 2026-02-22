
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  List, 
  Plus, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreHorizontal,
  Users,
  Activity,
  Calendar,
  ArrowLeft,
  Zap,
  Flag,
  MessageSquare,
  Paperclip,
  ChevronRight,
  BarChart3,
  TrendingDown,
  GanttChart,
  Edit3,
  BrainCircuit,
  UserCheck,
  Target,
  Save
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { MOCK_PROJECTS, MOCK_RESOURCES } from '../constants';
import { Project, Task, TaskStatus, Sprint, DeliveryData, Epic } from '../types';
import { generateInitialBacklog, generateEpicsFromPRD, refineEpicWithAI, getSquadAIInsights, generateTasksForEpic } from '../services/geminiService';
import CreateTaskModal from '../components/CreateTaskModal';
import CreateEpicModal from '../components/CreateEpicModal';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';

const DeliveryManagement: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [activeTab, setActiveTab] = useState<'board' | 'backlog' | 'squad' | 'analytics'>('board');
  const [squadInsights, setSquadInsights] = useState<string>('');
  const [isRefiningEpic, setIsRefiningEpic] = useState<string | null>(null);
  const [isGeneratingTasksForEpic, setIsGeneratingTasksForEpic] = useState<string | null>(null);
  
  // Modals & Drawers
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewEpicModalOpen, setIsNewEpicModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Helper to persist changes to localStorage
  const persistChanges = (updatedTasks: Task[], updatedEpics: Epic[], currentProject: Project) => {
    const localProjects = JSON.parse(localStorage.getItem('linkare_projects') || '[]');
    
    const doneTasks = updatedTasks.filter(t => t.status === 'Done').length;
    const newProgress = updatedTasks.length > 0 ? Math.round((doneTasks / updatedTasks.length) * 100) : 0;

    const updatedProject: Project = { 
      ...currentProject, 
      progress: newProgress,
      status: newProgress === 100 ? 'Completed' : 'Active' as any,
      delivery: { 
        ...(currentProject.delivery || { sprints: [], velocity: 0, blockers: [] }),
        tasks: updatedTasks, 
        epics: updatedEpics 
      } 
    };

    setProject(updatedProject);
    const updatedLocal = localProjects.map((p: Project) => p.id === currentProject.id ? updatedProject : p);
    if (!localProjects.some((p: Project) => p.id === currentProject.id)) {
      updatedLocal.push(updatedProject);
    }
    localStorage.setItem('linkare_projects', JSON.stringify(updatedLocal));
  };

  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        const localProjects = JSON.parse(localStorage.getItem('linkare_projects') || '[]');
        const allProjects = [...MOCK_PROJECTS, ...localProjects];
        const foundProject = allProjects.find(p => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
          
          if (!foundProject.delivery && foundProject.prd) {
            const [initialTasks, initialEpics] = await Promise.all([
              generateInitialBacklog(foundProject.prd!),
              generateEpicsFromPRD(foundProject.prd!)
            ]);
            setTasks(initialTasks);
            setEpics(initialEpics);
            persistChanges(initialTasks, initialEpics, foundProject);
          } else if (foundProject.delivery) {
            setTasks(foundProject.delivery.tasks || []);
            setEpics(foundProject.delivery.epics || []);
          }
        }
      } catch (e) {
        console.error("Delivery Init Error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  // Task Handlers
  const handleAddTask = (newTask: Task) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    if (project) persistChanges(updatedTasks, epics, project);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    if (project) persistChanges(updatedTasks, epics, project);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const updatedTasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    setTasks(updatedTasks);
    if (project) persistChanges(updatedTasks, epics, project);
  };

  // Epic Handlers
  const handleAddEpic = (newEpic: Epic) => {
    const updatedEpics = [newEpic, ...epics];
    setEpics(updatedEpics);
    if (project) persistChanges(tasks, updatedEpics, project);
  };

  const handleRefineEpic = async (epicId: string) => {
    const epic = epics.find(e => e.id === epicId);
    if (!epic) return;
    const instruction = prompt("How should Linkare AI refine this Epic?");
    if (!instruction) return;
    setIsRefiningEpic(epicId);
    try {
      const refined = await refineEpicWithAI(epic, instruction);
      const updatedEpics = epics.map(e => e.id === epicId ? refined : e);
      setEpics(updatedEpics);
      if (project) persistChanges(tasks, updatedEpics, project);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsRefiningEpic(null); 
    }
  };

  const handleGenerateTasksForEpic = async (epicId: string) => {
    const epic = epics.find(e => e.id === epicId);
    if (!epic || !project) return;
    setIsGeneratingTasksForEpic(epicId);
    try {
      const newTasks = await generateTasksForEpic(epic, project);
      const updatedTasks = [...tasks, ...newTasks.map(t => ({ ...t, epicId }))];
      setTasks(updatedTasks);
      persistChanges(updatedTasks, epics, project);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsGeneratingTasksForEpic(null); 
    }
  };

  const handleLoadSquadInsights = async () => {
    if (!project) return;
    setSquadInsights('AI is analyzing squad performance...');
    try {
      const insight = await getSquadAIInsights(project, tasks);
      setSquadInsights(insight);
    } catch (e) { 
      setSquadInsights('Failed to load insights.'); 
    }
  };

  // Drag and Drop Handlers
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDrop = (e: React.DragEvent, status: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    handleMoveTask(taskId, status);
  };

  const columns: TaskStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

  const burndownData = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 85, actual: 92 },
    { day: 'Day 3', ideal: 70, actual: 88 },
    { day: 'Day 4', ideal: 55, actual: 75 },
    { day: 'Day 5', ideal: 40, actual: 60 },
    { day: 'Day 6', ideal: 25, actual: 42 },
    { day: 'Day 7', ideal: 10, actual: 30 },
  ];

  if (loading) return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="text-blue-600 animate-pulse" size={32} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-black text-slate-900">Initializing Delivery System</h3>
        <p className="text-slate-500 font-medium">Linkare AI is mapping the PRD to technical tasks...</p>
      </div>
    </div>
  );

  if (!project) return (
    <div className="h-[calc(100vh-12rem)] flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center">
        <AlertCircle size={40} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-black text-slate-900">Project Not Found</h3>
        <p className="text-slate-500 font-medium mb-6">We couldn't find the project with ID: {projectId}</p>
        <Link to="/projects" className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all">
          Return to Portfolio
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/projects" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-black uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Portfolio
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{project.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Sprint 1 Active</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-xs text-slate-500 font-bold">Ends in 8 days</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setActiveTab('squad'); handleLoadSquadInsights(); }}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <Users size={18} />
            Squad View
          </button>
          <button 
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      {/* Delivery KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Project Progress</div>
          <div className="flex items-end justify-between mb-2">
            <div className="text-3xl font-black text-slate-900">{project.progress}%</div>
            <div className="text-xs font-bold text-blue-600">{tasks.filter(t => t.status === 'Done').length}/{tasks.length} Tasks</div>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Epics</div>
          <div className="text-3xl font-black text-slate-900">{epics.length}</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">High-level initiatives</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Open Blockers</div>
          <div className="text-3xl font-black text-red-600">2</div>
          <p className="text-xs text-red-500 mt-1 font-bold flex items-center gap-1">
            <AlertCircle size={12} /> High priority
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Health Score</div>
          <div className="text-3xl font-black text-green-600">94/100</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Optimal delivery pace</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        <button onClick={() => setActiveTab('board')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'board' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Kanban Board</button>
        <button onClick={() => setActiveTab('backlog')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'backlog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Backlog & Epics</button>
        <button onClick={() => setActiveTab('squad')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'squad' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Squad View</button>
        <button onClick={() => setActiveTab('analytics')} className={`pb-4 text-sm font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Analytics</button>
      </div>

      {/* Kanban Board */}
      {activeTab === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in fade-in duration-500">
          {columns.map(status => (
            <div 
              key={status} 
              className="space-y-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, status)}
            >
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{status}</h4>
                  <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-[10px] font-black">
                    {tasks.filter(t => t.status === status || (status === 'Todo' && t.status === 'Backlog')).length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 min-h-[500px] p-2 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                {tasks
                  .filter(t => t.status === status || (status === 'Todo' && t.status === 'Backlog'))
                  .map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter ${
                          task.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          task.priority === 'High' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {task.priority}
                        </span>
                        <button className="text-slate-300 group-hover:text-slate-600"><MoreHorizontal size={14} /></button>
                      </div>
                      <h5 className="text-sm font-bold text-slate-900 mb-2 leading-snug">{task.title}</h5>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                          {task.estimatedHours}h
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white overflow-hidden">
                          <img src={`https://picsum.photos/seed/${task.id}/24/24`} alt="Assignee" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Backlog & Epics View */}
      {activeTab === 'backlog' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                <Target size={20} className="text-blue-600" /> Project Epics
              </h3>
              <button onClick={() => setIsNewEpicModalOpen(true)} className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Add Epic</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {epics.map(epic => (
                <div key={epic.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-black text-slate-900">{epic.title}</h4>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerateTasksForEpic(epic.id)}
                        disabled={isGeneratingTasksForEpic === epic.id}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
                        title="Generate Tasks for this Epic"
                      >
                        {isGeneratingTasksForEpic === epic.id ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                      </button>
                      <button 
                        onClick={() => handleRefineEpic(epic.id)}
                        disabled={isRefiningEpic === epic.id}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                        title="Refine Epic with AI"
                      >
                        {isRefiningEpic === epic.id ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{epic.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{epic.status}</span>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                      {tasks.filter(t => t.epicId === epic.id).length} Tasks <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <List size={20} className="text-blue-600" /> Technical Backlog
            </h3>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Task</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}>
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-900">{task.title}</div>
                        <div className="text-xs text-slate-400 mt-1">{task.description}</div>
                      </td>
                      <td className="px-8 py-5"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{task.status}</span></td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          task.priority === 'Critical' ? 'bg-red-50 text-red-600' :
                          task.priority === 'High' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-600'
                        }`}>{task.priority}</span>
                      </td>
                      <td className="px-8 py-5"><div className="text-sm font-bold text-slate-600">{task.estimatedHours}h</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Squad View */}
      {activeTab === 'squad' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 flex items-center gap-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl"><BrainCircuit size={32} /></div>
              <div className="flex-1">
                <h3 className="text-xl font-black tracking-tight mb-2">AI Squad Intelligence</h3>
                <p className="text-slate-300 font-medium italic leading-relaxed">{squadInsights || "Click 'Squad View' to generate real-time performance insights."}</p>
              </div>
              <button onClick={handleLoadSquadInsights} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Refresh Insights</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.squad?.map((member, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shadow-inner"><img src={`https://picsum.photos/seed/member${i}/56/56`} alt={member.role} /></div>
                  <div>
                    <h4 className="font-black text-slate-900">{member.role}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase"><UserCheck size={12} /> Active</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold"><span className="text-slate-400 uppercase tracking-widest">Workload</span><span className="text-slate-900">75%</span></div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} /></div>
                  <div className="pt-4 flex justify-between items-center"><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks Assigned</div><div className="text-sm font-black text-slate-900">4</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><TrendingDown size={20} /></div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Sprint Burndown</h4>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="ideal" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><GanttChart size={20} /></div>
                <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Cumulative Flow</h4>
              </div>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burndownData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                  <Tooltip /><Area type="monotone" dataKey="actual" stackId="1" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* AI Delivery Assistant Sidebar (Floating) */}
      <div className="fixed bottom-10 right-10 z-40">
        <button className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-400 hover:scale-110 transition-transform group relative">
          <Sparkles size={28} />
          <div className="absolute bottom-full right-0 mb-4 w-72 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <h4 className="text-sm font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={14} className="text-blue-400" /> AI Delivery Insight</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">"Based on current velocity, Sprint 1 is on track. However, {tasks.filter(t => t.status === 'Review').length} tasks in 'Review' are pending. Consider reallocating QA resources."</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center"><span className="text-[10px] font-bold text-blue-400 uppercase">Confidence: 92%</span><button className="text-[10px] font-black uppercase tracking-widest hover:underline">Full Report</button></div>
          </div>
        </button>
      </div>

      {/* Modals & Drawers */}
      <CreateTaskModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} project={project} onAdd={handleAddTask} />
      <CreateEpicModal isOpen={isNewEpicModalOpen} onClose={() => setIsNewEpicModalOpen(false)} project={project} onAdd={handleAddEpic} />
      <TaskDetailsDrawer task={selectedTask} project={project} onClose={() => setSelectedTask(null)} onUpdate={handleUpdateTask} />
    </div>
  );
};

export default DeliveryManagement;
