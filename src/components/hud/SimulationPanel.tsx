import { Zap, Loader2, Thermometer } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { DashboardMode } from '@/components/dashboard/ModeSelector';
import { cn } from '@/lib/utils';

interface SimulationPanelProps {
  mode: DashboardMode;
  onSimulate: () => void;
  isSimulating: boolean;
  canSimulate: boolean;
  label?: string;
  temperature: number;
  onTemperatureChange: (value: number) => void;
}

const modeConfig = {
  agriculture: {
    color: 'emerald',
    gradientClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    shadowClass: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(16,185,129,0.4)]',
    hoverShadowClass: 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(16,185,129,0.6)]',
  },
  coastal: {
    color: 'teal',
    gradientClass: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    shadowClass: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(20,184,166,0.4)]',
    hoverShadowClass: 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(20,184,166,0.6)]',
  },
  flood: {
    color: 'blue',
    gradientClass: 'bg-gradient-to-r from-blue-600 to-blue-400',
    shadowClass: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(59,130,246,0.4)]',
    hoverShadowClass: 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(59,130,246,0.6)]',
  },
  portfolio: {
    color: 'purple',
    gradientClass: 'bg-gradient-to-r from-purple-600 to-purple-400',
    shadowClass: 'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(147,51,234,0.4)]',
    hoverShadowClass: 'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(147,51,234,0.6)]',
  },
};

export const SimulationPanel = ({
  mode,
  onSimulate,
  isSimulating,
  canSimulate,
  label,
  temperature,
  onTemperatureChange,
}: SimulationPanelProps) => {
  const config = modeConfig[mode];

  const getResilienceScore = () => {
    const base = 85;
    const reduction = temperature * 20;
    return Math.max(0, Math.min(100, base - reduction));
  };

  const resilienceScore = getResilienceScore();

  const getScoreColor = () => {
    if (resilienceScore >= 70) return 'bg-emerald-500';
    if (resilienceScore >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = () => {
    if (resilienceScore >= 70) return 'text-emerald-400';
    if (resilienceScore >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const buttonLabel =
    label ||
    (mode === 'agriculture'
      ? 'Simulate Resilience'
      : mode === 'coastal'
        ? 'Simulate Protection'
        : 'Simulate Flood Risk');

  return (
    <GlassCard className="w-full lg:w-80 p-3 lg:p-4">
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center gap-2 text-xs lg:text-sm font-medium text-white/70">
          <Thermometer className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400" />
          <span>Simulation Parameters</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] lg:text-xs text-white/50">Temperature Increase</span>
            <span className="text-sm lg:text-base font-bold text-amber-400 tabular-nums">+{temperature.toFixed(1)}°C</span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(v) => onTemperatureChange(v[0])}
            min={0}
            max={3}
            step={0.1}
            className="w-full [&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-emerald-500 [&_[data-radix-slider-range]]:via-amber-500 [&_[data-radix-slider-range]]:to-red-500 [&_[data-radix-slider-thumb]]:border-white/50 [&_[data-radix-slider-thumb]]:bg-white"
          />
          <div className="flex justify-between text-[10px] lg:text-xs text-white/40">
            <span>0°C</span>
            <span>+1.5°C</span>
            <span>+3°C</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] lg:text-xs text-white/50">Resilience Score</span>
            <span className={cn('text-xs lg:text-sm font-semibold tabular-nums', getScoreTextColor())}>
              {Math.round(resilienceScore)}%
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-500 rounded-full', getScoreColor())}
              style={{ width: `${resilienceScore}%` }}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onSimulate}
          disabled={!canSimulate || isSimulating}
          className={cn(
            'w-full h-11 lg:h-12 text-xs lg:text-sm font-semibold text-white transition-all duration-200 rounded-xl',
            'hover:scale-[1.02] active:scale-[0.98]',
            config.gradientClass,
            config.shadowClass,
            config.hoverShadowClass,
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          {isSimulating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              {buttonLabel}
            </>
          )}
        </Button>

        {!canSimulate && (
          <p className="text-[10px] lg:text-xs text-white/40 text-center">Select a location on the map first</p>
        )}
      </div>
    </GlassCard>
  );
};
