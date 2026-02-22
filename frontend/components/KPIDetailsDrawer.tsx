
import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  CheckCircle2, 
  DollarSign, 
  AlertCircle, 
  Sparkles, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus,
  Activity,
  Target,
  ShieldAlert
} from 'lucide-react';
import { KPIType, Project, KPIAnalysis } from '../types';
import { generateKPIAnalysis } from '../services/geminiService';
import { StatusBadge, HealthIndicator } from './ProjectShared';

interface KPIDetailsDrawerProps {
  type: KPIType | null;
  projects: Project[];
  onClose: () => void;
}

const KPIDetailsDrawer: React.FC<KPIDetailsDrawerProps> = ({ type, projects, onClose }) => {
  const [analysis, setAnalysis] = useState<KPIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type) {
      const fetchAnalysis = async () => {
        setLoading(true);
        try {
          const result = await generateKPIAnalysis(type, projects);
          setAnalysis(result);
        } catch (error) {
          console.error("Error fetching KPI analysis:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    } else {
      setAnalysis(null);
    }
  }, [type, projects]);

  if (!type) return null;

  const getTitle = () => {
    switch (type) {
      case 'progress': return 'Portfolio Delivery Progress';
      case 'completed': return 'Completed Projects Analysis';
      case 'budget': return 'Financial Performance & Budget';
      case 'risk': return 'Risk Exposure & Mitigation';
    }
  };

  const getIcon = () => {
    const props = { size: 24, className: "text-white" };
    switch (type) {
      case 'progress': return <TrendingUp {...props} />;
      case 'completed': return <CheckCircle2 {...props} />;
      case 'budget': return <DollarSign {...props} />;
      case 'risk': return <AlertCircle {...props} />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'progress': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      case 'budget': return 'bg-amber-600';
      case 'risk': return 'bg-red-600';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${getBgColor()} rounded-2xl flex items-center justify-center shadow-lg`}>
              {getIcon()}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{getTitle()}</h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Portfolio Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* AI Analysis Section */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-blue-400" size={20} />
                  <span className="font-black uppercase tracking-widest text-xs">AI Executive Insight</span>
                </div>
                {analysis && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-tighter">
                    Trend: {analysis.trend === 'improving' ? <ArrowUpRight size={12} className="text-green-400" /> : analysis.trend === 'declining' ? <ArrowDownRight size={12} className="text-red-400" /> : <Minus size={12} className="text-blue-400" />}
                    <span className="ml-1">{analysis.trend}</span>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 text-slate-400 py-4">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm font-medium">Synthesizing portfolio data...</span>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  <p className="text-slate-300 leading-relaxed font-medium italic">"{analysis.summary}"</p>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Strategic Recommendations</h4>
                    {analysis.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="w-5 h-5 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Unable to generate analysis at this time.</p>
              )}
            </div>
          </section>

          {/* Data Breakdown Section */}
          <section className="space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              Metric Breakdown
            </h3>
            
            <div className="space-y-4">
              {type === 'progress' && projects.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-900 text-sm">{p.title}</span>
                    <span className="text-xs font-black text-blue-600">{p.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}

              {type === 'risk' && projects.filter(p => p.health !== 'On Track').map(p => (
                <div key={p.id} className="p-4 border border-red-100 bg-red-50/30 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-[10px] text-red-600 font-black uppercase mt-1">Critical Path Impact</div>
                  </div>
                  <HealthIndicator health={p.health} />
                </div>
              ))}

              {type === 'budget' && projects.map(p => (
                <div key={p.id} className="p-4 border border-slate-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{p.title}</div>
                    <div className="text-[10px] text-slate-400 font-black uppercase mt-1">Utilization</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">{p.budgetUtilization}%</div>
                    <div className={`text-[10px] font-bold ${p.budgetUtilization > 90 ? 'text-red-500' : 'text-green-600'}`}>
                      {p.budgetUtilization > 90 ? 'Over Budget' : 'On Target'}
                    </div>
                  </div>
                </div>
              ))}

              {type === 'completed' && (
                <div className="text-center py-12 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <CheckCircle2 size={40} className="text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">12 Projects successfully delivered this quarter.</p>
                  <button className="mt-4 text-blue-600 text-xs font-black uppercase tracking-widest hover:underline">View Archive</button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6">
          <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
            Close Intelligence View
          </button>
        </div>
      </div>
    </>
  );
};

export default KPIDetailsDrawer;
