
import { Resource, Project, ResourceAllocationStats } from './types';

export const MOCK_RESOURCES: Resource[] = [
  { 
    id: '1', 
    name: 'Ana Silva', 
    role: 'Frontend Developer', 
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Redux'], 
    availability: 'Available', 
    experienceLevel: 'Senior', 
    allocationPercentage: 0,
    email: 'ana.silva@linkare.ai',
    phone: '+55 11 98888-7777',
    location: 'São Paulo, SP',
    joinedDate: '2021-03-15',
    bio: 'Senior Frontend Engineer with 8+ years of experience building scalable web applications. Specialist in React ecosystem and performance optimization.',
    certifications: ['AWS Certified Developer', 'Meta Front-End Professional'],
    projectHistory: [
      { name: 'Global Bank App', role: 'Lead Frontend', period: '2023 - 2024', description: 'Led the migration of the core banking dashboard to React.' },
      { name: 'E-Health Portal', role: 'Senior Dev', period: '2022 - 2023', description: 'Developed a real-time patient monitoring interface.' }
    ]
  },
  { 
    id: '2', 
    name: 'Bruno Costa', 
    role: 'Backend Developer', 
    skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis'], 
    availability: 'Busy', 
    experienceLevel: 'Mid', 
    allocationPercentage: 100,
    email: 'bruno.costa@linkare.ai',
    phone: '+55 11 97777-6666',
    location: 'Curitiba, PR',
    joinedDate: '2022-06-10',
    bio: 'Backend specialist focused on microservices architecture and high-availability systems.',
    certifications: ['AWS Solutions Architect', 'Node.js Services Developer'],
    projectHistory: [
      { name: 'Logistics Hub', role: 'Backend Dev', period: '2023 - Present', description: 'Scaling the order processing engine to handle 1M+ requests/day.' }
    ]
  },
  { 
    id: '3', 
    name: 'Carla Souza', 
    role: 'UX/UI Designer', 
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], 
    availability: 'Available', 
    experienceLevel: 'Senior', 
    allocationPercentage: 20,
    email: 'carla.souza@linkare.ai',
    phone: '+55 21 96666-5555',
    location: 'Rio de Janeiro, RJ',
    joinedDate: '2020-11-01',
    bio: 'Product Designer passionate about creating intuitive user experiences and robust design systems.',
    certifications: ['Google UX Design Professional', 'Nielsen Norman Group UX Certified'],
    projectHistory: [
      { name: 'Fintech Wallet', role: 'Lead Designer', period: '2023', description: 'Redesigned the mobile wallet experience, increasing retention by 15%.' }
    ]
  },
  { 
    id: '4', 
    name: 'Diego Lima', 
    role: 'Project Manager', 
    skills: ['Agile', 'Scrum', 'Risk Management', 'Jira'], 
    availability: 'Available', 
    experienceLevel: 'Lead', 
    allocationPercentage: 40,
    email: 'diego.lima@linkare.ai',
    phone: '+55 31 95555-4444',
    location: 'Belo Horizonte, MG',
    joinedDate: '2019-05-20',
    bio: 'Strategic Project Manager with a track record of delivering complex IT projects on time and within budget.',
    certifications: ['PMP', 'Certified Scrum Master (CSM)'],
    projectHistory: [
      { name: 'Cloud Migration X', role: 'Project Lead', period: '2022 - 2023', description: 'Managed the migration of 50+ legacy apps to AWS.' }
    ]
  },
  { 
    id: '5', 
    name: 'Elena Martins', 
    role: 'QA Engineer', 
    skills: ['Jest', 'Cypress', 'Automation', 'Selenium'], 
    availability: 'Partially Available', 
    experienceLevel: 'Mid', 
    allocationPercentage: 60,
    email: 'elena.martins@linkare.ai',
    phone: '+55 11 94444-3333',
    location: 'São Paulo, SP',
    joinedDate: '2023-01-15',
    bio: 'QA Engineer dedicated to ensuring software quality through automated testing and rigorous manual checks.',
    certifications: ['ISTQB Foundation Level'],
    projectHistory: [
      { name: 'Retail Checkout', role: 'QA Automation', period: '2023 - Present', description: 'Implemented end-to-end testing suite for the checkout flow.' }
    ]
  },
  { 
    id: '6', 
    name: 'Fabio Santos', 
    role: 'DevOps Engineer', 
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Ansible'], 
    availability: 'Available', 
    experienceLevel: 'Senior', 
    allocationPercentage: 0,
    email: 'fabio.santos@linkare.ai',
    phone: '+55 11 93333-2222',
    location: 'São Paulo, SP',
    joinedDate: '2021-08-12',
    bio: 'Infrastructure as Code enthusiast. Expert in building resilient CI/CD pipelines and managing Kubernetes clusters.',
    certifications: ['CKA (Certified Kubernetes Administrator)', 'HashiCorp Certified: Terraform Associate'],
    projectHistory: [
      { name: 'SaaS Platform Scale', role: 'DevOps Lead', period: '2022 - 2023', description: 'Automated infrastructure provisioning using Terraform and Ansible.' }
    ]
  }
];

export const ALLOCATION_STATS: ResourceAllocationStats = {
  totalResources: 45,
  averageUtilization: 72,
  onBench: 8,
  overAllocated: 3
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PRJ-001',
    title: 'E-commerce Platform Revamp',
    description: 'Modernizing the legacy e-commerce platform with a headless architecture and React frontend.',
    duration: '6 months',
    industry: 'Retail',
    status: 'Active',
    progress: 65,
    budgetUtilization: 45,
    health: 'On Track',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    plData: {
      revenue: 250000,
      laborCosts: 110000,
      cloudCosts: 25000,
      licenseCosts: 15000,
      grossProfit: 100000,
      marginPercentage: 40,
      burnRate: 25000,
      aiSuggestions: [
        "Optimize AWS Lambda usage to reduce cloud costs by 12%.",
        "Consolidate SaaS licenses for monitoring tools (Datadog/New Relic).",
        "Shift 20% of manual QA to automated regression to lower labor burn."
      ]
    },
    scope: {
      objectives: ['Increase conversion rate by 20%', 'Reduce page load time to < 2s', 'Implement mobile-first design'],
      deliverables: ['New UI/UX Design', 'Headless API Integration', 'Payment Gateway Migration'],
      risks: ['Data migration complexity', 'Third-party API downtime'],
      timeline: [
        { phase: 'Discovery', duration: '4 weeks' },
        { phase: 'Design', duration: '6 weeks' },
        { phase: 'Development', duration: '12 weeks' }
      ]
    },
    squad: [
      { role: 'Frontend Lead', count: 1, reasoning: 'Required for complex React architecture.' },
      { role: 'Backend Dev', count: 2, reasoning: 'Needed for API integrations.' }
    ],
    matches: [
      { role: 'Frontend Lead', suggestedResource: MOCK_RESOURCES[0], matchScore: 95, matchReason: 'Expert in React and Tailwind.' }
    ]
  },
  {
    id: 'PRJ-002',
    title: 'AI Customer Support Bot',
    description: 'Implementing a generative AI chatbot to handle first-level customer inquiries.',
    duration: '3 months',
    industry: 'Customer Service',
    status: 'At Risk',
    progress: 30,
    budgetUtilization: 60,
    health: 'At Risk',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    plData: {
      revenue: 120000,
      laborCosts: 75000,
      cloudCosts: 30000,
      licenseCosts: 5000,
      grossProfit: 10000,
      marginPercentage: 8.3,
      burnRate: 35000,
      aiSuggestions: [
        "High GPU/LLM token costs detected; implement caching for common queries.",
        "Review squad allocation: Senior dev hours are exceeding budget for R&D.",
        "Switch to a tiered API plan for OpenAI/Vertex AI to stabilize costs."
      ]
    },
    scope: {
      objectives: ['Automate 40% of support tickets', 'Improve CSAT scores'],
      deliverables: ['LLM Integration', 'Knowledge Base Sync', 'Admin Dashboard'],
      risks: ['Hallucination management', 'Privacy compliance'],
      timeline: [
        { phase: 'Model Selection', duration: '2 weeks' },
        { phase: 'Training', duration: '4 weeks' }
      ]
    }
  },
  {
    id: 'PRJ-003',
    title: 'Cloud Infrastructure Migration',
    description: 'Moving on-premise servers to a multi-cloud environment using AWS and Azure.',
    duration: '12 months',
    industry: 'IT Services',
    status: 'Active',
    progress: 15,
    budgetUtilization: 10,
    health: 'On Track',
    startDate: '2024-04-10',
    endDate: '2025-04-10',
    plData: {
      revenue: 500000,
      laborCosts: 180000,
      cloudCosts: 120000,
      licenseCosts: 50000,
      grossProfit: 150000,
      marginPercentage: 30,
      burnRate: 29000,
      aiSuggestions: [
        "Leverage AWS Savings Plans for the target production environment.",
        "Monitor data egress fees during the migration phase.",
        "Automate environment teardown for non-production hours."
      ]
    }
  }
];
