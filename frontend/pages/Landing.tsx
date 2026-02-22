
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Briefcase, 
  Users, 
  ArrowRight, 
  Sparkles,
  BarChart3,
  Zap,
  Target
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: 'pmo',
      title: 'PMO Governance',
      description: 'High-level portfolio oversight, P&L analysis, and strategic alignment. Monitor health and financial performance across all business units.',
      icon: ShieldCheck,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      path: '/dashboard',
      features: ['Portfolio KPIs', 'P&L Intelligence', 'Risk Governance']
    },
    {
      id: 'pm',
      title: 'Project Managers',
      description: 'Delivery-focused workspace. Manage project lifecycles, define AI-driven scopes, and optimize squad compositions for maximum efficiency.',
      icon: Briefcase,
      color: 'bg-slate-900',
      lightColor: 'bg-slate-100',
      textColor: 'text-slate-900',
      path: '/projects',
      features: ['Scope Generation', 'Squad Suggestion', 'Task Assignment']
    },
    {
      id: 'team',
      title: 'Equipa (Resources)',
      description: 'Talent management and capacity planning. Match the right skills to the right projects using AI-powered scouting and allocation tracking.',
      icon: Users,
      color: 'bg-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      path: '/resources',
      features: ['AI Talent Scout', 'Skill Matrix', 'Utilization Tracking']
    }
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center py-12">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} />
            Linkare Command Center
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight animate-in fade-in slide-in-from-top-6 duration-700 delay-100">
            Intelligent Project <span className="text-blue-600">Orchestration.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium animate-in fade-in slide-in-from-top-8 duration-700 delay-200">
            Empowering Linkare with AI-driven insights for governance, delivery, and talent management.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {cards.map((card, i) => (
            <div 
              key={card.id}
              onClick={() => navigate(card.path)}
              className="group bg-white rounded-[3rem] border border-slate-100 p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative overflow-hidden animate-in fade-in zoom-in-95 duration-700"
              style={{ animationDelay: `${300 + i * 100}ms` }}
            >
              {/* Hover Background Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.lightColor} blur-3xl rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10 space-y-8">
                <div className={`w-16 h-16 ${card.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-${card.id}-200 group-hover:scale-110 transition-transform`}>
                  <card.icon size={32} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">{card.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {card.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <div className={`w-1.5 h-1.5 rounded-full ${card.color}`} />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className={`pt-4 flex items-center gap-2 font-black uppercase tracking-widest text-xs ${card.textColor}`}>
                  Enter Workspace
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats/Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100 animate-in fade-in duration-1000 delay-700">
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900">24/7</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">AI Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900">100%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Data Driven</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900">15+</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Active Squads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-900">98%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Match Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
