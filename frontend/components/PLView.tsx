
import React, { useState } from 'react';
import { 
  Activity, 
  PieChart, 
  Sparkles, 
  ArrowUpRight, 
  Flame, 
  Loader2, 
  Users, 
  Cloud, 
  FileKey 
} from 'lucide-react';
import { Project, PLData } from '../types';
import { generatePLAnalysis } from '../services/geminiService';

export const PLView: React.FC<{ project: Project }> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(project.plData?.aiSuggestions || []);

  const handleRefreshAI = async () => {
    if (!project.plData) return;
    setLoading(true);
    try {
      const newSuggestions = await generatePLAnalysis(project, project.plData);
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error("Error refreshing AI suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const data = project.plData || {
    revenue: 0,
    laborCosts: 0,
    cloudCosts: 0,
    licenseCosts: 0,
    grossProfit: 0,
    marginPercentage: 0,
    burnRate: 0,
    aiSuggestions: []
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Total Revenue</div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(data.revenue)}</div>
          <div className="flex items-center gap-1 text-green-600 text-[10px] mt-2 font-medium">
            <ArrowUpRight size={12} /> +8% vs target
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Gross Profit</div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(data.grossProfit)}</div>
          <div className="flex items-center gap-1 text-blue-600 text-[10px] mt-2 font-medium">
            <PieChart size={12} /> {data.marginPercentage}% Margin
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Monthly Burn</div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(data.burnRate)}</div>
          <div className="flex items-center gap-1 text-amber-600 text-[10px] mt-2 font-medium">
            <Flame size={12} /> High Velocity
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl space-y-6">
        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Activity size={18} className="text-slate-400" />
          IT Cost Breakdown (COGS)
        </h4>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={14} className="text-blue-500" /> Labor Costs
              </div>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(data.laborCosts)}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${(data.laborCosts / data.revenue) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Cloud size={14} className="text-cyan-500" /> Cloud Infrastructure
              </div>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(data.cloudCosts)}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500" style={{ width: `${(data.cloudCosts / data.revenue) * 100}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileKey size={14} className="text-purple-500" /> Software Licenses
              </div>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(data.licenseCosts)}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${(data.licenseCosts / data.revenue) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h4 className="font-bold flex items-center gap-2 text-blue-400">
            <Sparkles size={20} />
            Linkare AI Financial Insights
          </h4>
          <button 
            onClick={handleRefreshAI}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Activity size={18} />}
          </button>
        </div>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex gap-3 items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm leading-relaxed text-slate-300">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
