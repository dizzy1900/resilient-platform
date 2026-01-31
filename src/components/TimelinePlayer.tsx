import { useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

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

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        onYearChange(selectedYear >= MAX_YEAR ? MIN_YEAR : selectedYear + 1);
      }, INTERVAL_MS);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, selectedYear, onYearChange]);

  const progress = ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;

  return (
    <div
      className={`fixed bottom-8 z-40 ${
        isSplitMode
          ? "left-[calc(240px+25vw)] -translate-x-1/2 w-[280px]"
          : "left-1/2 -translate-x-1/2 w-[90%] max-w-lg"
      }`}
    >
      <div className={`bg-black/60 backdrop-blur-md rounded-lg border border-white/10 shadow-xl ${
        isSplitMode ? "px-3 py-2" : "px-6 py-4"
      }`}>
        <div className={`flex items-center ${isSplitMode ? "gap-2" : "gap-4"}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPlayToggle}
            className={`rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0 ${
              isSplitMode ? "h-7 w-7" : "h-10 w-10"
            }`}
          >
            {isPlaying ? (
              <Pause className={isSplitMode ? "h-3.5 w-3.5" : "h-5 w-5"} />
            ) : (
              <Play className={`ml-0.5 ${isSplitMode ? "h-3.5 w-3.5" : "h-5 w-5"}`} />
            )}
          </Button>

          <div className={`text-white font-bold tabular-nums text-center shrink-0 ${
            isSplitMode ? "text-base w-12" : "text-2xl w-16"
          }`}>
            {selectedYear}
          </div>

          <div className={`flex-1 flex flex-col ${isSplitMode ? "gap-1" : "gap-2"}`}>
            <Slider
              value={[selectedYear]}
              onValueChange={(value) => onYearChange(value[0])}
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              className="w-full [&_[data-radix-slider-track]]:bg-white/20 [&_[data-radix-slider-range]]:bg-emerald-500 [&_[data-radix-slider-thumb]]:border-emerald-500 [&_[data-radix-slider-thumb]]:bg-white"
            />
            <div className={`flex justify-between text-white/60 ${isSplitMode ? "text-[10px]" : "text-xs"}`}>
              <span>{MIN_YEAR}</span>
              <span>{MAX_YEAR}</span>
            </div>
          </div>
        </div>

        <div className={`bg-white/10 rounded-full overflow-hidden ${isSplitMode ? "mt-1.5 h-0.5" : "mt-3 h-1"}`}>
          <div
            className="h-full bg-emerald-500/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
