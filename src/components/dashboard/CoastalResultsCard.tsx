import { Shield, TrendingUp, Info, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CoastalResultsCardProps {
  visible: boolean;
  isLoading: boolean;
  valueProtected: number;
  waveAttenuation: number;
  mangroveWidth: number;
}

export const CoastalResultsCard = ({
  visible,
  isLoading,
  valueProtected,
  waveAttenuation,
  mangroveWidth,
}: CoastalResultsCardProps) => {
  if (!visible && !isLoading) return null;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <Card className="glass-panel border-primary/30 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Waves className="w-5 h-5 text-primary" />
            Coastal Protection
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-primary/20 text-primary border-primary/30 text-xs"
          >
            {mangroveWidth}m mangrove
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Value Protected */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Value Protected</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">
                    Estimated economic value of coastal assets protected by the mangrove buffer against storm surge and flooding.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isLoading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="metric-big text-primary">
                {formatCurrency(valueProtected)}
              </span>
              <Shield className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        {/* Wave Attenuation */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Wave Attenuation</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">
                    Percentage of wave energy absorbed by the mangrove belt before reaching the shoreline.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className="text-lg font-bold bg-primary/10 text-primary border-primary/30 px-3 py-1"
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                {waveAttenuation}%
              </Badge>
            </div>
          )}
        </div>

        {/* Visual indicator bar */}
        <div className="pt-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
              style={{ width: `${Math.min(waveAttenuation, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Low protection</span>
            <span>High protection</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
