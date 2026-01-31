import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Calendar } from 'lucide-react';

interface TimelinePlayerProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  isSplitMode?: boolean;
}

const MIN_YEAR = 2026;
const MAX_YEAR = 2050;
const INTERVAL_MS = 800;

export function TimelinePlayer({
  selectedYear,
  onYearChange,
  isPlaying,
  onPlayToggle,
  isSplitMode = false,
}: TimelinePlayerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleYearIncrement = useCallback(() => {
    onYearChange(selectedYear >= MAX_YEAR ? MIN_YEAR : selectedYear + 1);
  }, [selectedYear, onYearChange]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(handleYearIncrement, INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, handleYearIncrement]);

  const progress = useMemo(
    () => ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100,
    [selectedYear]
  );

  const handleSliderChange = useCallback(
    (value: number[]) => {
      onYearChange(value[0]);
    },
    [onYearChange]
  );

  const sliderBaseClasses = "w-full group";
  const sliderTrackClasses = "[&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-track]]:rounded-full [&_[data-radix-slider-track]]:transition-all [&_[data-radix-slider-track]]:duration-200 hover:[&_[data-radix-slider-track]]:bg-white/15";
  const sliderRangeClasses = "[&_[data-radix-slider-range]]:bg-gradient-to-r [&_[data-radix-slider-range]]:from-emerald-500 [&_[data-radix-slider-range]]:via-teal-500 [&_[data-radix-slider-range]]:to-cyan-500 [&_[data-radix-slider-range]]:transition-all [&_[data-radix-slider-range]]:duration-300";
  const sliderThumbClasses = "[&_[data-radix-slider-thumb]]:border-2 [&_[data-radix-slider-thumb]]:border-white/90 [&_[data-radix-slider-thumb]]:bg-emerald-500 [&_[data-radix-slider-thumb]]:shadow-lg [&_[data-radix-slider-thumb]]:shadow-emerald-500/40 [&_[data-radix-slider-thumb]]:transition-all [&_[data-radix-slider-thumb]]:duration-200 hover:[&_[data-radix-slider-thumb]]:scale-110 hover:[&_[data-radix-slider-thumb]]:shadow-xl hover:[&_[data-radix-slider-thumb]]:shadow-emerald-500/50 focus:[&_[data-radix-slider-thumb]]:ring-2 focus:[&_[data-radix-slider-thumb]]:ring-emerald-400/50 focus:[&_[data-radix-slider-thumb]]:ring-offset-2 focus:[&_[data-radix-slider-thumb]]:ring-offset-black/50";
  const sliderHeightClasses = isSplitMode
    ? '[&_[data-radix-slider-track]]:h-1.5 sm:[&_[data-radix-slider-track]]:h-2'
    : '[&_[data-radix-slider-track]]:h-2 sm:[&_[data-radix-slider-track]]:h-2.5 lg:[&_[data-radix-slider-track]]:h-3';

  return (
    <div
      className={`fixed bottom-4 sm:bottom-6 z-40 transition-all duration-300 ease-out ${
        isSplitMode
          ? 'left-1/2 -translate-x-1/2 w-[95%] sm:w-[360px]'
          : 'left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] max-w-3xl'
      }`}
    >
      <div
        className={`bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-2xl rounded-2xl lg:rounded-3xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.5)] ${
          isSplitMode ? 'px-3 py-2.5 sm:px-4 sm:py-3' : 'px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5'
        }`}
      >
        <div className={`flex items-center ${isSplitMode ? 'gap-2 sm:gap-3' : 'gap-3 sm:gap-4 lg:gap-5'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayToggle}
            className={`rounded-xl lg:rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white shrink-0 border border-white/15 transition-all duration-300 hover:shadow-lg ${
              isSplitMode ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12'
            } ${
              isPlaying
                ? 'bg-emerald-500/25 border-emerald-400/40 hover:bg-emerald-500/30 shadow-emerald-500/20'
                : 'hover:border-white/25'
            }`}
          >
            <div className="relative">
              {isPlaying ? (
                <Pause
                  className={`${isSplitMode ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5'} transition-all duration-200 animate-in fade-in-0 zoom-in-50`}
                />
              ) : (
                <Play
                  className={`ml-0.5 ${isSplitMode ? 'h-3.5 w-3.5 sm:h-4 sm:w-4' : 'h-4 w-4 sm:h-5 sm:w-5 lg:h-5 lg:w-5'} transition-all duration-200 animate-in fade-in-0 zoom-in-50`}
                />
              )}
            </div>
          </Button>

          <div
            className={`flex items-center gap-1.5 sm:gap-2 shrink-0 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 ${
              isSplitMode ? 'min-w-[65px] sm:min-w-[75px]' : 'min-w-[80px] sm:min-w-[95px] lg:min-w-[110px]'
            }`}
          >
            <Calendar
              className={`text-emerald-400 shrink-0 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] ${
                isSplitMode ? 'w-3.5 h-3.5 sm:w-4 sm:h-4' : 'w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5'
              }`}
            />
            <span
              className={`text-white font-bold tabular-nums tracking-tight transition-all duration-200 ${
                isSplitMode ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl lg:text-3xl'
              }`}
              key={selectedYear}
              style={{
                animation: 'fadeInScale 0.3s ease-out',
              }}
            >
              {selectedYear}
            </span>
          </div>

          <div className={`flex-1 flex flex-col ${isSplitMode ? 'gap-1 sm:gap-1.5' : 'gap-1.5 sm:gap-2'}`}>
            <Slider
              value={[selectedYear]}
              onValueChange={handleSliderChange}
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              className={`${sliderBaseClasses} ${sliderHeightClasses} ${sliderTrackClasses} ${sliderRangeClasses} ${sliderThumbClasses}`}
            />
            <div
              className={`flex justify-between items-center text-white/50 font-medium transition-colors duration-200 ${
                isSplitMode ? 'text-[9px] sm:text-[10px]' : 'text-[10px] sm:text-xs'
              }`}
            >
              <span className="transition-colors duration-200 hover:text-white/70">{MIN_YEAR}</span>
              <span className="text-white/35 hidden sm:inline transition-colors duration-200 hover:text-white/50">
                Climate Projection Timeline
              </span>
              <span className="transition-colors duration-200 hover:text-white/70">{MAX_YEAR}</span>
            </div>
          </div>
        </div>

        <div
          className={`bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 ${
            isSplitMode ? 'mt-2 h-0.5 sm:h-1' : 'mt-2.5 sm:mt-3 h-1 sm:h-1.5'
          }`}
        >
          <div
            className="h-full bg-gradient-to-r from-emerald-500/70 via-teal-500/70 to-cyan-500/70 transition-all duration-500 ease-out rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
