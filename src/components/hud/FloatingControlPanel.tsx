import { Wheat, Waves, Droplets, Activity, MapPin } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type DashboardMode = 'agriculture' | 'coastal' | 'flood';

interface FloatingControlPanelProps {
  mode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  activeMetric: string;
  coordinates: { lat: number; lng: number } | null;
}

export const FloatingControlPanel = ({
  mode,
  onModeChange,
  activeMetric,
  coordinates,
}: FloatingControlPanelProps) => {
  const getModeIcon = () => {
    switch (mode) {
      case 'agriculture':
        return <Wheat className="w-4 h-4 text-emerald-400" />;
      case 'coastal':
        return <Waves className="w-4 h-4 text-blue-400" />;
      case 'flood':
        return <Droplets className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="glass-card w-80 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 blur-lg opacity-40" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-blue-400">ADAPTMetric</span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">Resilience Engine</span>
        </div>
      </div>

      {/* Mode Toggles - Segmented glass buttons */}
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as DashboardMode)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-11 bg-white/5 border border-white/10 rounded-xl p-1">
          <TabsTrigger 
            value="agriculture" 
            className="flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border data-[state=active]:border-emerald-500/30"
          >
            <Wheat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Agriculture</span>
          </TabsTrigger>
          <TabsTrigger 
            value="coastal" 
            className="flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-500/30"
          >
            <Waves className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Coastal</span>
          </TabsTrigger>
          <TabsTrigger 
            value="flood" 
            className="flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 data-[state=active]:border data-[state=active]:border-blue-500/30"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Flood</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Active Metric Card */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground tracking-widest uppercase">Active Analysis</span>
          {getModeIcon()}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-foreground">{activeMetric}</span>
        </div>
      </div>

      {/* Coordinates Display */}
      {coordinates && (
        <div className="flex items-center gap-2 px-1">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-mono text-muted-foreground">
            {coordinates.lat.toFixed(4)}°, {coordinates.lng.toFixed(4)}°
          </span>
        </div>
      )}
    </div>
  );
};
