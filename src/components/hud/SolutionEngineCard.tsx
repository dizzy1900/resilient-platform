import { useState, useEffect } from 'react';
import { Lightbulb, Star } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

interface AdaptationStrategy {
  intervention_name: string;
  intervention_cost_usd: number;
  npv_improvement_usd: number;
  adaptation_roi_pct: number;
}

interface PortfolioOption {
  tier: string;
  cost: number;
  roi: number;
  benefit: number;
}

interface AdaptationPortfolio {
  options: PortfolioOption[];
  recommended_strategy: string;
  stress_level: number;
  analysis_timestamp: string;
}

interface SolutionEngineCardProps {
  strategy: AdaptationStrategy | null;
  portfolio?: AdaptationPortfolio | null;
}

const formatCurrency = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

export const SolutionEngineCard = ({ strategy, portfolio }: SolutionEngineCardProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  // Auto-select recommended strategy when portfolio changes
  useEffect(() => {
    if (portfolio?.recommended_strategy) {
      setSelectedTier(portfolio.recommended_strategy);
    } else if (portfolio?.options?.length) {
      setSelectedTier(portfolio.options[0].tier);
    }
  }, [portfolio]);

  // If we have a portfolio, render the tabbed version
  if (portfolio?.options?.length) {
    const selected = portfolio.options.find(o => o.tier === selectedTier) ?? portfolio.options[0];
    const isRecommended = selected.tier === portfolio.recommended_strategy;

    const chartData = [
      { name: 'Cost', value: selected.cost, fill: '#ef4444' },
      { name: 'Benefit', value: selected.benefit, fill: '#10b981' },
    ];

    return (
      <GlassCard className="p-4 w-full space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Solution Engine</h3>
        </div>

        {/* Tier Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {portfolio.options.map((opt) => (
            <button
              key={opt.tier}
              onClick={() => setSelectedTier(opt.tier)}
              className={`flex-1 px-2 py-1.5 text-[10px] font-semibold rounded-lg transition-all ${
                selectedTier === opt.tier
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              {opt.tier}
            </button>
          ))}
        </div>

        {/* Selected Strategy */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/50 uppercase tracking-wider">Strategy</span>
              <p className="text-sm font-semibold text-white mt-0.5">🛡️ {selected.tier}</p>
            </div>
            {isRecommended && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px] gap-1">
                <Star className="w-3 h-3 fill-amber-300" />
                Best ROI
              </Badge>
            )}
          </div>
        </div>

        {/* Cost vs Benefit Chart */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-white/50 uppercase tracking-wider">Cost vs Benefit</span>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} width={45} axisLine={false} tickLine={false} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] text-white/40 mt-1">
            <span>Cost: {formatCurrency(selected.cost)}</span>
            <span>Benefit: {formatCurrency(selected.benefit)}</span>
          </div>
        </div>

        {/* ROI */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/60">ROI</span>
          <span className={`text-2xl font-bold tabular-nums ${selected.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {selected.roi.toFixed(1)}%
          </span>
        </div>
      </GlassCard>
    );
  }

  // Fallback: legacy single-strategy view
  if (!strategy) return null;

  return (
    <GlassCard className="p-4 w-full space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Recommended Intervention</h3>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <span className="text-[10px] text-white/50 uppercase tracking-wider">Strategy</span>
        <p className="text-base font-semibold text-white mt-1">🛡️ {strategy.intervention_name}</p>
      </div>
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/60">Cost to Implement</span>
          <span className="text-sm font-bold text-red-400 tabular-nums">{formatCurrency(strategy.intervention_cost_usd)}</span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/60">Net Benefit</span>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">{formatCurrency(strategy.npv_improvement_usd)}</span>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs text-white/60">ROI</span>
          <span className="text-2xl font-bold text-emerald-400 tabular-nums">{strategy.adaptation_roi_pct.toFixed(0)}%</span>
        </div>
      </div>
    </GlassCard>
  );
};
