import { useState, useEffect } from 'react';
import { Lightbulb, Star } from 'lucide-react';
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

function DataRow({ label, value, valueColor }: { label: string; value: React.ReactNode; valueColor?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 cb-divider">
      <span className="cb-label">{label}</span>
      <span className="cb-value" style={valueColor ? { color: valueColor } : {}}>
        {value}
      </span>
    </div>
  );
}

export const SolutionEngineCard = ({ strategy, portfolio }: SolutionEngineCardProps) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  useEffect(() => {
    if (portfolio?.recommended_strategy) {
      setSelectedTier(portfolio.recommended_strategy);
    } else if (portfolio?.options?.length) {
      setSelectedTier(portfolio.options[0].tier);
    }
  }, [portfolio]);

  if (portfolio?.options?.length) {
    const selected = portfolio.options.find(o => o.tier === selectedTier) ?? portfolio.options[0];
    const isRecommended = selected.tier === portfolio.recommended_strategy;

    const chartData = [
      { name: 'COST', value: selected.cost, fill: '#f43f5e' },
      { name: 'BENEFIT', value: selected.benefit, fill: '#10b981' },
    ];

    return (
      <div>
        <div className="px-4 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid var(--cb-border)' }}>
          <Lightbulb style={{ width: 10, height: 10, color: 'var(--cb-secondary)' }} />
          <span className="cb-section-heading">SOLUTION ENGINE</span>
        </div>

        <div className="flex border-b" style={{ borderColor: 'var(--cb-border)' }}>
          {portfolio.options.map((opt) => (
            <button
              key={opt.tier}
              onClick={() => setSelectedTier(opt.tier)}
              className="flex-1 py-2 transition-colors"
              style={{
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: '0.05em',
                color: selectedTier === opt.tier ? 'var(--cb-text)' : 'var(--cb-secondary)',
                borderBottom: selectedTier === opt.tier ? '2px solid var(--cb-text)' : '2px solid transparent',
                marginBottom: -1,
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              {opt.tier.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="px-4">
          <DataRow
            label="STRATEGY"
            value={
              <span className="flex items-center gap-1">
                {isRecommended && <Star style={{ width: 8, height: 8, color: '#f59e0b' }} />}
                {selected.tier.toUpperCase()}
              </span>
            }
          />

          <div className="py-2.5 cb-divider">
            <span className="cb-label" style={{ display: 'block', marginBottom: 8 }}>COST / BENEFIT</span>
            <div style={{ height: 60 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: 'var(--cb-secondary)', fontSize: 9, fontFamily: 'monospace' }}
                    width={48}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Bar dataKey="value" radius={0} barSize={10}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-1">
              <span className="cb-label">COST: {formatCurrency(selected.cost)}</span>
              <span className="cb-label">BENEFIT: {formatCurrency(selected.benefit)}</span>
            </div>
          </div>

          <DataRow
            label="ADAPTATION ROI"
            value={`${selected.roi.toFixed(1)}%`}
            valueColor={selected.roi >= 0 ? '#10b981' : '#f43f5e'}
          />
        </div>
      </div>
    );
  }

  if (!strategy) return null;

  return (
    <div>
      <div className="px-4 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid var(--cb-border)' }}>
        <Lightbulb style={{ width: 10, height: 10, color: 'var(--cb-secondary)' }} />
        <span className="cb-section-heading">RECOMMENDED INTERVENTION</span>
      </div>

      <div className="px-4">
        <DataRow label="STRATEGY" value={strategy.intervention_name.toUpperCase()} />
        <DataRow label="IMPLEMENTATION COST" value={formatCurrency(strategy.intervention_cost_usd)} valueColor="#f43f5e" />
        <DataRow label="NET BENEFIT" value={formatCurrency(strategy.npv_improvement_usd)} valueColor="#10b981" />
        <DataRow label="ADAPTATION ROI" value={`${strategy.adaptation_roi_pct.toFixed(0)}%`} valueColor="#10b981" />
      </div>
    </div>
  );
};
