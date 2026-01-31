import { useState, useEffect } from 'react';
import { Thermometer, Activity, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface SimulationPanelProps {
  onTemperatureChange?: (temp: number) => void;
  resilienceScore?: number;
}

export const SimulationPanel = ({
  onTemperatureChange,
  resilienceScore: externalScore,
}: SimulationPanelProps) => {
  const [temperature, setTemperature] = useState(1.5);
  
  // Calculate resilience score based on temperature (inverse relationship)
  // Higher temperature = lower resilience
  const calculatedScore = externalScore ?? Math.max(0, 100 - (temperature * 25));
  
  useEffect(() => {
    onTemperatureChange?.(temperature);
  }, [temperature, onTemperatureChange]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-orange-500';
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-orange-600 to-orange-500';
  };

  const getBarGlow = (score: number) => {
    if (score >= 70) return 'shadow-emerald-500/30';
    if (score >= 40) return 'shadow-yellow-500/30';
    return 'shadow-orange-500/30';
  };

  return (
    <div className="glass-card w-80 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold text-foreground tracking-wide uppercase">Simulation Parameters</span>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium text-muted-foreground">Temperature Increase</span>
          </div>
          <span className={cn(
            "text-lg font-bold tabular-nums",
            temperature >= 2 ? "text-orange-500" : temperature >= 1 ? "text-yellow-400" : "text-emerald-400"
          )}>
            +{temperature.toFixed(1)}°C
          </span>
        </div>
        
        <div className="relative pt-1">
          <Slider
            value={[temperature]}
            onValueChange={(values) => setTemperature(values[0])}
            min={0}
            max={3}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">0°C</span>
            <span className="text-[10px] text-muted-foreground">+3°C</span>
          </div>
        </div>
      </div>

      {/* Resilience Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-muted-foreground">Resilience Score</span>
          </div>
          <span className={cn("text-lg font-bold tabular-nums", getScoreColor(calculatedScore))}>
            {Math.round(calculatedScore)}%
          </span>
        </div>
        
        {/* Animated progress bar */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out shadow-lg",
              getBarColor(calculatedScore),
              getBarGlow(calculatedScore)
            )}
            style={{ width: `${calculatedScore}%` }}
          />
        </div>
        
        {/* Scale markers */}
        <div className="flex justify-between">
          <span className="text-[10px] text-orange-500">High Risk</span>
          <span className="text-[10px] text-yellow-400">Moderate</span>
          <span className="text-[10px] text-emerald-400">Resilient</span>
        </div>
      </div>
    </div>
  );
};
