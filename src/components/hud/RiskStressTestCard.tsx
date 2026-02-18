import { ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';

interface MonteCarloData {
  metrics?: {
    npv_usd?: {
      mean?: number;
      std?: number;
      p5?: number;
      min?: number;
    };
  };
}

interface SensitivityData {
  primary_driver: string;
  driver_impact_pct: number;
}

interface RiskStressTestCardProps {
  monteCarloData: MonteCarloData | null;
  sensitivityData?: SensitivityData | null;
}

const getVaR95 = (mc: MonteCarloData): number => {
  return mc.metrics?.npv_usd?.p5 ?? 0;
};

const getDefaultProbability = (mc: MonteCarloData): number => {
  const mean = mc.metrics?.npv_usd?.mean ?? 0;
  const std = mc.metrics?.npv_usd?.std ?? 1;
  if (std === 0) return mean < 0 ? 100 : 0;
  const z = -mean / std;
  const prob = 1 / (1 + Math.exp(-1.7 * z));
  return Math.max(0, Math.min(100, prob * 100));
};

const formatCurrency = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const getDefaultProbColor = (prob: number) => {
  if (prob < 5) return { bar: '#10b981', text: '#10b981', label: 'LOW RISK' };
  if (prob < 20) return { bar: '#f59e0b', text: '#f59e0b', label: 'MODERATE' };
  return { bar: '#f43f5e', text: '#f43f5e', label: 'HIGH RISK' };
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

export const RiskStressTestCard = ({ monteCarloData, sensitivityData }: RiskStressTestCardProps) => {
  if (!monteCarloData) return null;

  const var95 = getVaR95(monteCarloData);
  const defaultProb = getDefaultProbability(monteCarloData);
  const isVarNegative = var95 < 0;
  const probStyle = getDefaultProbColor(defaultProb);

  return (
    <div>
      <div className="px-4 pt-3 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid var(--cb-border)' }}>
        <ShieldAlert style={{ width: 10, height: 10, color: 'var(--cb-secondary)' }} />
        <span className="cb-section-heading">RISK STRESS TEST</span>
      </div>

      <div className="px-4">
        <DataRow
          label="VALUE AT RISK (95%)"
          value={
            <span className="flex items-center gap-1">
              {isVarNegative
                ? <TrendingDown style={{ width: 10, height: 10 }} />
                : <TrendingUp style={{ width: 10, height: 10 }} />
              }
              {formatCurrency(var95)}
            </span>
          }
          valueColor={isVarNegative ? '#f43f5e' : '#10b981'}
        />

        <div className="py-2.5 cb-divider">
          <div className="flex items-center justify-between mb-1.5">
            <span className="cb-label">DEFAULT PROBABILITY</span>
            <span className="cb-value" style={{ color: probStyle.text }}>
              {defaultProb.toFixed(1)}% · {probStyle.label}
            </span>
          </div>
          <div className="w-full h-px relative" style={{ backgroundColor: 'var(--cb-border)' }}>
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: `${Math.min(defaultProb, 100)}%`,
                backgroundColor: probStyle.bar,
                height: 2,
                marginTop: -0.5,
              }}
            />
          </div>
        </div>

        {sensitivityData && (
          <DataRow
            label="PRIMARY RISK DRIVER"
            value={`${sensitivityData.primary_driver} · ${sensitivityData.driver_impact_pct}%`}
            valueColor="#f43f5e"
          />
        )}
      </div>
    </div>
  );
};

export { getDefaultProbability };
