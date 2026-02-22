
export interface ProjectData {
  title: string;
  description: string;
  duration: string;
  industry: string;
  value?: string;
  estimatedStartDate?: string;
}

export interface ProjectScope {
  objectives: string[];
  deliverables: string[];
  risks: string[];
  timeline: { phase: string; duration: string }[];
}

export interface SquadRole {
  role: string;
  count: number;
  reasoning: string;
}

export interface ResourceProject {
  name: string;
  role: string;
  period: string;
  description: string;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  skills: string[];
  availability: 'Available' | 'Busy' | 'Partially Available';
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  allocationPercentage?: number;
  email: string;
  phone: string;
  location: string;
  bio: string;
  certifications: string[];
  projectHistory: ResourceProject[];
  joinedDate: string;
}

export interface ResourceMatch {
  role: string;
  suggestedResource: Resource | null;
  matchScore: number;
  matchReason: string;
}

export type ProjectStatus = 'Active' | 'Completed' | 'On Hold' | 'At Risk';

export interface PLData {
  revenue: number;
  laborCosts: number;
  cloudCosts: number;
  licenseCosts: number;
  grossProfit: number;
  marginPercentage: number;
  burnRate: number; // Monthly spend in USD
  aiSuggestions: string[];
}

export interface PRD {
  introduction: string;
  goals: string[];
  userPersonas: { name: string; role: string; needs: string }[];
  functionalRequirements: { feature: string; description: string; priority: 'High' | 'Medium' | 'Low' }[];
  technicalStack: { layer: string; technology: string; reasoning: string }[];
  developmentInstructions: string[];
}

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  epicId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  estimatedHours: number;
  tags: string[];
  devNotes?: string;
  technicalRequirements?: string[];
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed';
}

export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Planned' | 'Completed';
  goal: string;
}

export interface DeliveryData {
  epics: Epic[];
  tasks: Task[];
  sprints: Sprint[];
  currentSprintId?: string;
  velocity: number;
  blockers: string[];
}

export interface Project extends ProjectData {
  id: string;
  status: ProjectStatus;
  progress: number;
  budgetUtilization: number;
  health: 'On Track' | 'At Risk' | 'Critical';
  startDate: string;
  endDate: string;
  scope?: ProjectScope;
  squad?: SquadRole[];
  matches?: ResourceMatch[];
  plData?: PLData;
  prd?: PRD;
  delivery?: DeliveryData;
}

export interface ResourceAllocationStats {
  totalResources: number;
  averageUtilization: number;
  onBench: number;
  overAllocated: number;
}

export type KPIType = 'progress' | 'completed' | 'budget' | 'risk';

export interface KPIAnalysis {
  summary: string;
  recommendations: string[];
  trend: 'improving' | 'declining' | 'stable';
}

export interface SuggestedTask {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}
