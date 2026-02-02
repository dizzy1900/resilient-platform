import { TrendingDown, TrendingUp, MapPin } from 'lucide-react';
import { Polygon, calculatePolygonArea } from '@/utils/polygonMath';
import { ZoneMode } from '@/utils/zoneGeneration';
import { cn } from '@/lib/utils';

interface ZoneLegendProps {
  baselineZone: Polygon | null;
  currentZone: Polygon | null;
  mode: ZoneMode;
  temperature: number;
  visible: boolean;
}

const modeLabels = {
  agriculture: {
    label: 'Viable Growing Area',
    shrinkLabel: 'Lost',
    expandLabel: 'Gained',
  },
  coastal: {
    label: 'Safe Zone',
    shrinkLabel: 'At Risk',
    expandLabel: 'Protected',
  },
  flood: {
    label: 'Flood Risk Zone',
    shrinkLabel: 'Reduced',
    expandLabel: 'Expanded',
  },
};

export const ZoneLegend = ({
  baselineZone,
  currentZone,
  mode,
  temperature,
  visible,
}: ZoneLegendProps) => {
  if (!visible || !baselineZone || !currentZone) return null;

  const baseArea = calculatePolygonArea(baselineZone);
  const currentArea = calculatePolygonArea(currentZone);
  const areaChange = currentArea - baseArea;
  const percentChange = baseArea > 0 ? (areaChange / baseArea) * 100 : 0;

  const labels = modeLabels[mode];
  const isExpanding = mode === 'flood';
  const isNegative = isExpanding ? percentChange > 0 : percentChange < 0;

  const formatArea = (area: number) => {
    if (area >= 1000) {
      return `${(area / 1000).toFixed(1)}k`;
    }
    return area.toFixed(0);
  };

  return (
    <div
      className={cn(
        'bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-2xl',
        'transition-all duration-300',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-3.5 h-3.5 text-white/60" />
        <span className="text-xs font-medium text-white/70">{labels.label}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-white/50">Baseline (0°C)</span>
          <span className="text-xs font-semibold text-white tabular-nums">
            {formatArea(baseArea)} km²
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-white/50">Current (+{temperature.toFixed(1)}°C)</span>
          <span className="text-xs font-semibold text-white tabular-nums">
            {formatArea(currentArea)} km²
          </span>
        </div>

        <div className="h-px bg-white/10 my-1" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-[10px] text-white/50">
            {isNegative ? labels.shrinkLabel : labels.expandLabel}
          </span>
          <div className="flex items-center gap-1">
            {isNegative ? (
              <TrendingDown className="w-3 h-3 text-red-400" />
            ) : (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            )}
            <span
              className={cn(
                'text-xs font-bold tabular-nums',
                isNegative ? 'text-red-400' : 'text-emerald-400'
              )}
            >
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
