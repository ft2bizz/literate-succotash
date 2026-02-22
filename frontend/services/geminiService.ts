
import { GoogleGenAI, Type } from '@google/genai';
import { ProjectData, ProjectScope, SquadRole, Resource, ResourceMatch, PLData, Project, KPIType, KPIAnalysis, SuggestedTask, PRD, Task, Epic } from '../types';

const ai = new GoogleGenAI({ apiKey: (process.env.API_KEY as string), vertexai: true });

// ... (previous functions remain the same)

export const generateProjectScope = async (project: ProjectData): Promise<ProjectScope> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Generate a comprehensive project management scope for the following project:
        Title: ${project.title}
        Description: ${project.description}
        Duration: ${project.duration}
        Industry: ${project.industry}
        Project Value: ${project.value || 'Not specified'}
        Estimated Start Date: ${project.estimatedStartDate || 'Not specified'}`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ['phase', 'duration']
            }
          }
        },
        required: ['objectives', 'deliverables', 'risks', 'timeline']
      }
    }
  });

  return JSON.parse(response.text);
};

export const suggestSquadComposition = async (project: ProjectData): Promise<SquadRole[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Suggest the ideal squad composition for this project:
        Title: ${project.title}
        Description: ${project.description}
        Duration: ${project.duration}
        Project Value: ${project.value || 'Not specified'}`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            count: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ['role', 'count', 'reasoning']
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const matchResources = async (project: ProjectData, squad: SquadRole[], resources: Resource[]): Promise<ResourceMatch[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Match the following company resources to the required squad roles for this project.
        Project: ${project.title} - ${project.description}
        Required Squad: ${JSON.stringify(squad)}
        Available Resources: ${JSON.stringify(resources)}
        
        For each role in the squad, find the best matching resource from the list. If no good match exists, set suggestedResource to null.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            role: { type: Type.STRING },
            suggestedResource: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING }
              },
              nullable: true
            },
            matchScore: { type: Type.NUMBER, description: 'Score from 0 to 100' },
            matchReason: { type: Type.STRING }
          },
          required: ['role', 'matchScore', 'matchReason']
        }
      }
    }
  });

  const matches = JSON.parse(response.text);
  return matches.map((m: any) => ({
    ...m,
    suggestedResource: m.suggestedResource ? resources.find(r => r.id === m.suggestedResource.id) || null : null
  }));
};

export const generatePLAnalysis = async (project: ProjectData, currentPL: Partial<PLData>): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Analyze the Profit and Loss (P&L) for this IT project at Linkare and provide 3-5 strategic AI suggestions. 
        Focus on: Cloud Cost Optimization (FinOps), Labor Efficiency, Technical Debt reduction, and License Management.
        Project: ${project.title}
        Industry: ${project.industry}
        Current Financials: ${JSON.stringify(currentPL)}`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'A list of strategic IT-focused financial suggestions.'
      }
    }
  });

  return JSON.parse(response.text);
};

export interface ScoutResult {
  resourceId: string;
  matchScore: number;
  reasoning: string;
}

export const scoutResources = async (query: string, resources: Resource[]): Promise<ScoutResult[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Act as a world-class HR Talent Scout for Linkare, an IT consulting firm. 
        Given the following natural language query and a list of company resources, identify the top 3-5 resources that best match the request.
        
        Query: "${query}"
        
        Resources: ${JSON.stringify(resources.map(r => ({
          id: r.id,
          name: r.name,
          role: r.role,
          skills: r.skills,
          experience: r.experienceLevel,
          availability: r.availability,
          allocation: r.allocationPercentage
        })))}
        
        Return a JSON array of objects with resourceId, matchScore (0-100), and a brief reasoning.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            resourceId: { type: Type.STRING },
            matchScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ['resourceId', 'matchScore', 'reasoning']
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generatePortfolioSummary = async (projects: Project[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Analyze this portfolio of IT projects and provide a concise (2-3 sentences) executive summary of the overall health, main risks, and a strategic recommendation.
        
        Projects: ${JSON.stringify(projects.map(p => ({
          title: p.title,
          status: p.status,
          health: p.health,
          progress: p.progress,
          budget: p.budgetUtilization
        })))}`
      }]
    }
  });

  return response.text;
};

export const generateKPIAnalysis = async (type: KPIType, projects: Project[]): Promise<KPIAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Analyze the following portfolio data specifically for the KPI: "${type}".
        Data: ${JSON.stringify(projects.map(p => ({
          title: p.title,
          status: p.status,
          health: p.health,
          progress: p.progress,
          budget: p.budgetUtilization,
          industry: p.industry
        })))}
        
        Provide a summary of the current state, 3 actionable recommendations, and a trend assessment.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          trend: { type: Type.STRING, enum: ['improving', 'declining', 'stable'] }
        },
        required: ['summary', 'recommendations', 'trend']
      }
    }
  });

  return JSON.parse(response.text);
};

export const suggestTask = async (resource: Resource, project: Project): Promise<SuggestedTask> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Suggest a high-impact task for the following resource on the specified project.
        
        Resource: ${resource.name} (${resource.role})
        Skills: ${resource.skills.join(', ')}
        Experience: ${resource.experienceLevel}
        
        Project: ${project.title}
        Description: ${project.description}
        
        Return a JSON object with title, description, and priority.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] }
        },
        required: ['title', 'description', 'priority']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateProjectPRD = async (project: Project): Promise<PRD> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Generate a complete Product Requirements Document (PRD) for the following IT project.
        
        Project: ${project.title}
        Description: ${project.description}
        Industry: ${project.industry}
        Duration: ${project.duration}
        
        Include:
        1. Introduction & Context
        2. Strategic Goals
        3. User Personas
        4. Functional Requirements (with priorities)
        5. Recommended Technical Stack (with reasoning)
        6. Detailed Development Instructions for the engineering team.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          introduction: { type: Type.STRING },
          goals: { type: Type.ARRAY, items: { type: Type.STRING } },
          userPersonas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING },
                needs: { type: Type.STRING }
              },
              required: ['name', 'role', 'needs']
            }
          },
          functionalRequirements: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                feature: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] }
              },
              required: ['feature', 'description', 'priority']
            }
          },
          technicalStack: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                layer: { type: Type.STRING },
                technology: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ['layer', 'technology', 'reasoning']
            }
          },
          developmentInstructions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['introduction', 'goals', 'userPersonas', 'functionalRequirements', 'technicalStack', 'developmentInstructions']
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateInitialBacklog = async (prd: PRD): Promise<Task[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Based on the following PRD, generate an initial backlog of 8-12 technical tasks for the development team.
        
        PRD Summary: ${prd.introduction}
        Functional Requirements: ${JSON.stringify(prd.functionalRequirements)}
        Technical Stack: ${JSON.stringify(prd.technicalStack)}
        
        Return a JSON array of Task objects with: id (random string), title, description, status (always 'Backlog'), priority, estimatedHours, and tags.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Backlog'] },
            priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            estimatedHours: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['id', 'title', 'description', 'status', 'priority', 'estimatedHours', 'tags']
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateEpicsFromPRD = async (prd: PRD): Promise<Epic[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Based on the following PRD, identify 4-6 high-level Epics for the project.
        PRD: ${prd.introduction}
        Requirements: ${JSON.stringify(prd.functionalRequirements)}
        
        Return a JSON array of Epic objects with: id (random string), title, description, and status (always 'Planned').`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Planned'] }
          },
          required: ['id', 'title', 'description', 'status']
        }
      }
    }
  });
  return JSON.parse(response.text);
};

export const refineEpicWithAI = async (epic: Epic, instruction: string): Promise<Epic> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Refine the following project Epic based on this instruction: "${instruction}".
        Current Epic: ${JSON.stringify(epic)}
        
        Return the updated Epic as a JSON object.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          status: { type: Type.STRING }
        },
        required: ['id', 'title', 'description', 'status']
      }
    }
  });
  return JSON.parse(response.text);
};

export const getSquadAIInsights = async (project: Project, tasks: Task[]): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Analyze the current squad performance and workload for this project.
        Project: ${project.title}
        Squad: ${JSON.stringify(project.squad)}
        Tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority })))}
        
        Provide a concise AI insight (2 sentences) about team efficiency and potential bottlenecks.`
      }]
    }
  });
  return response.text;
};

export const suggestEpic = async (project: Project): Promise<Partial<Epic>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Suggest a new high-level Epic for the following project.
        Project: ${project.title}
        Description: ${project.description}
        Current Epics: ${JSON.stringify(project.delivery?.epics.map(e => e.title))}
        
        Return a JSON object with title and description.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['title', 'description']
      }
    }
  });
  return JSON.parse(response.text);
};

export const generateTasksForEpic = async (epic: Epic, project: Project): Promise<Task[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      role: 'user',
      parts: [{
        text: `Generate 3-5 technical tasks for the following Epic within the specified project.
        
        Epic: ${epic.title} - ${epic.description}
        Project: ${project.title} - ${project.description}
        
        Return a JSON array of Task objects with: id (random string), title, description, status (always 'Todo'), priority, estimatedHours, and tags.`
      }]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Todo'] },
            priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            estimatedHours: { type: Type.NUMBER },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['id', 'title', 'description', 'status', 'priority', 'estimatedHours', 'tags']
        }
      }
    }
  });
  return JSON.parse(response.text);
};
