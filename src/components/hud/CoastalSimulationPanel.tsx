import { useState, useRef, useCallback, useEffect } from 'react';
import { Zap, Loader2, Waves, Calendar, CloudRain, Info, ToggleLeft, ToggleRight } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CoastalSimulationPanelProps {
  onSimulate: () => void;
  isSimulating: boolean;
  canSimulate: boolean;
  seaLevelRise: number;
  onSeaLevelRiseChange: (value: number) => void;
  includeStormSurge: boolean;
  onIncludeStormSurgeChange: (value: boolean) => void;
  selectedYear: number;
  onSelectedYearChange: (value: number) => void;
}

// SLR anchor points (IPCC projections)
const SLR_ANCHORS = [
  { year: 2030, slr: 0.05 },
  { year: 2050, slr: 0.19 },
];

// Calculate SLR from year using linear interpolation
const calculateSLRFromYear = (year: number): number => {
  if (year <= SLR_ANCHORS[0].year) {
    // Linear interpolation from 0 at 2025 to first anchor
    const t = (year - 2025) / (SLR_ANCHORS[0].year - 2025);
    return t * SLR_ANCHORS[0].slr;
  }
  
  for (let i = 0; i < SLR_ANCHORS.length - 1; i++) {
    const current = SLR_ANCHORS[i];
    const next = SLR_ANCHORS[i + 1];
    
    if (year >= current.year && year <= next.year) {
      const t = (year - current.year) / (next.year - current.year);
      return current.slr + t * (next.slr - current.slr);
    }
  }
  
  // Beyond last anchor - extrapolate
  const last = SLR_ANCHORS[SLR_ANCHORS.length - 1];
  const rate = (last.slr - SLR_ANCHORS[0].slr) / (last.year - SLR_ANCHORS[0].year);
  return last.slr + rate * (year - last.year);
};

const STORM_SURGE_HEIGHT = 2.5; // meters added for 1-in-100 year storm

export const CoastalSimulationPanel = ({
  onSimulate,
  isSimulating,
  canSimulate,
  seaLevelRise,
  onSeaLevelRiseChange,
  includeStormSurge,
  onIncludeStormSurgeChange,
  selectedYear,
  onSelectedYearChange,
}: CoastalSimulationPanelProps) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Handle year change with automatic SLR interpolation
  const handleYearChange = useCallback((year: number) => {
    onSelectedYearChange(year);
    const interpolatedSLR = calculateSLRFromYear(year);
    onSeaLevelRiseChange(Math.round(interpolatedSLR * 100) / 100);
  }, [onSelectedYearChange, onSeaLevelRiseChange]);

  // Debounced simulation trigger
  const triggerDebouncedSimulation = useCallback(() => {
    if (!canSimulate) return;
    
    setIsDebouncing(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      setIsDebouncing(false);
      onSimulate();
    }, 500);
  }, [canSimulate, onSimulate]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Calculate total water level (SLR + optional storm surge)
  const totalWaterLevel = seaLevelRise + (includeStormSurge ? STORM_SURGE_HEIGHT : 0);

  const getSLRBadgeColor = () => {
    if (seaLevelRise <= 0.1) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
    if (seaLevelRise <= 0.5) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getTotalWaterColor = () => {
    if (totalWaterLevel <= 0.5) return 'text-emerald-400';
    if (totalWaterLevel <= 1.5) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <GlassCard className="w-full lg:w-80 p-2.5 sm:p-3 lg:p-4">
      <div className="space-y-3 lg:space-y-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs lg:text-sm font-medium text-white/70">
          <Waves className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-teal-400" />
          <span>Coastal Parameters</span>
          {isDebouncing && (
            <span className="ml-auto text-[10px] text-white/40 animate-pulse">Updating...</span>
          )}
        </div>

        {/* Year Slider (Timeline) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-white/50" />
              <span className="text-[10px] lg:text-xs text-white/50">Projection Year</span>
            </div>
            <Badge className="text-[10px] px-2 py-0.5 border bg-white/10 text-white/80 border-white/20">
              {selectedYear}
            </Badge>
          </div>
          <Slider
            value={[selectedYear]}
            onValueChange={(v) => handleYearChange(v[0])}
            min={2025}
            max={2100}
            step={5}
            className="w-full [&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-teal-500 [&_[data-radix-slider-range]]:via-cyan-500 [&_[data-radix-slider-range]]:to-blue-500 [&_[data-radix-slider-thumb]]:border-white/50 [&_[data-radix-slider-thumb]]:bg-white"
          />
          <div className="flex justify-between text-[9px] lg:text-[10px] text-white/40">
            <span>2025</span>
            <span>2050</span>
            <span>2100</span>
          </div>
        </div>

        {/* Sea Level Rise Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Waves className="w-3 h-3 text-teal-400" />
              <span className="text-[10px] lg:text-xs text-white/50">Sea Level Rise (SLR)</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-white/40 hover:text-white/60 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-[200px] bg-slate-900/95 backdrop-blur-xl border-white/10"
                  >
                    <p className="text-xs">
                      Projected rise in mean sea level. Values auto-update based on IPCC projections for the selected year.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge className={cn('text-[10px] px-2 py-0.5 font-bold tabular-nums border', getSLRBadgeColor())}>
              +{seaLevelRise.toFixed(2)}m
            </Badge>
          </div>
          <Slider
            value={[seaLevelRise]}
            onValueChange={(v) => onSeaLevelRiseChange(v[0])}
            min={0}
            max={2.0}
            step={0.01}
            className="w-full [&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-teal-500 [&_[data-radix-slider-range]]:via-cyan-500 [&_[data-radix-slider-range]]:to-blue-500 [&_[data-radix-slider-thumb]]:border-white/50 [&_[data-radix-slider-thumb]]:bg-white"
          />
          <div className="flex justify-between text-[9px] lg:text-[10px] text-white/40">
            <span>0m</span>
            <span>1.0m</span>
            <span>2.0m</span>
          </div>
        </div>

        {/* Storm Surge Toggle */}
        <div className="space-y-1.5">
          <button
            onClick={() => onIncludeStormSurgeChange(!includeStormSurge)}
            className={cn(
              'w-full flex items-center justify-between p-2.5 rounded-xl border transition-all duration-200',
              includeStormSurge
                ? 'bg-cyan-500/10 border-cyan-500/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            )}
          >
            <div className="flex items-center gap-2">
              <CloudRain className={cn('w-4 h-4', includeStormSurge ? 'text-cyan-400' : 'text-white/50')} />
              <div className="text-left">
                <span className={cn('text-xs font-medium', includeStormSurge ? 'text-cyan-400' : 'text-white/70')}>
                  1-in-100 Year Storm Surge
                </span>
                <p className="text-[9px] text-white/40">Adds +{STORM_SURGE_HEIGHT}m to calculation</p>
              </div>
            </div>
            {includeStormSurge ? (
              <ToggleRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-white/40" />
            )}
          </button>
        </div>

        {/* Total Water Level Display */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] lg:text-xs text-white/50">Total Water Level</span>
            <span className={cn('text-xs lg:text-sm font-semibold tabular-nums', getTotalWaterColor())}>
              +{totalWaterLevel.toFixed(2)}m
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all duration-500 rounded-full',
                totalWaterLevel <= 0.5 ? 'bg-emerald-500' : totalWaterLevel <= 1.5 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${Math.min((totalWaterLevel / 4.5) * 100, 100)}%` }}
            />
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onSimulate}
          disabled={!canSimulate || isSimulating}
          className={cn(
            'w-full h-10 lg:h-11 text-xs lg:text-sm font-semibold text-white transition-all duration-200 rounded-xl',
            'hover:scale-[1.02] active:scale-[0.98]',
            'bg-gradient-to-r from-teal-500 to-cyan-500',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_0_20px_rgba(20,184,166,0.4)]',
            'hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_30px_rgba(20,184,166,0.6)]',
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
              Simulate Coastal Risk
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
