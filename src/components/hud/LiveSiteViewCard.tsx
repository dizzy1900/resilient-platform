import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MapPin, TrendingUp, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
} from 'recharts';

interface SatellitePreview {
  thumbnail_url: string;
  capture_date: string;
  cloud_cover: number;
  satellite_id: string;
}

interface MarketIntelligence {
  credit_rating: string;
  outlook?: string;
  sector_rank?: {
    by_npv: number;
    total_in_sector: number;
  };
  percentiles?: {
    composite: number;
  };
}

interface TemporalAnalysis {
  history: { year: number; npv: number; default_prob: number }[];
  stranded_asset_year: number | null;
}

interface LiveSiteViewCardProps {
  satellitePreview: SatellitePreview | null;
  marketIntelligence?: MarketIntelligence | null;
  temporalAnalysis?: TemporalAnalysis | null;
}

const getOutlookIndicator = (outlook?: string) => {
  const normalized = (outlook ?? '').toLowerCase();
  if (normalized === 'positive') return { symbol: '▲', color: 'text-emerald-500' };
  if (normalized.includes('negative') || normalized.includes('watch')) return { symbol: '▼', color: 'text-red-500' };
  return { symbol: '▬', color: '' };
};

export const LiveSiteViewCard = ({ satellitePreview, marketIntelligence, temporalAnalysis }: LiveSiteViewCardProps) => {
  const [open, setOpen] = useState(false);

  const hasTemporalData = temporalAnalysis?.history?.some(h => h.npv !== 0) ?? false;

  return (
    <>
      <div className="w-full">
        <div
          className={`relative w-full aspect-[16/9] overflow-hidden ${satellitePreview ? 'cursor-pointer' : ''}`}
          onClick={() => satellitePreview && setOpen(true)}
        >
          {satellitePreview ? (
            <img
              src={satellitePreview.thumbnail_url}
              alt="Satellite view of site"
              className="w-full h-full object-cover transition-opacity hover:opacity-80"
              style={{ filter: 'grayscale(100%)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${satellitePreview ? 'hidden' : ''}`} style={{ backgroundColor: 'var(--cb-surface)' }}>
            <MapPin style={{ width: 20, height: 20, color: 'var(--cb-secondary)' }} />
          </div>

          {marketIntelligence?.credit_rating && (
            <TooltipProvider delayDuration={200}>
              <UiTooltip>
                <TooltipTrigger asChild>
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1 cursor-default"
                    style={{
                      border: '1px solid var(--cb-border)',
                      backgroundColor: 'var(--cb-bg)',
                      padding: '2px 6px',
                      fontFamily: 'monospace',
                      fontSize: 11,
                      letterSpacing: '0.05em',
                      color: 'var(--cb-text)',
                    }}
                  >
                    <span>{marketIntelligence.credit_rating}</span>
                    {marketIntelligence.outlook && (
                      <span className={getOutlookIndicator(marketIntelligence.outlook).color} style={{ fontSize: 9 }}>
                        {getOutlookIndicator(marketIntelligence.outlook).symbol}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[200px] text-xs">
                  Projected rating change based on 2030–2050 climate trajectory.
                </TooltipContent>
              </UiTooltip>
            </TooltipProvider>
          )}
        </div>

        {satellitePreview && (
          <p className="px-4 pt-1 pb-2" style={{ fontSize: 10, color: 'var(--cb-secondary)', fontFamily: 'monospace', letterSpacing: '0.02em' }}>
            SENTINEL-2 · {new Date(satellitePreview.capture_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()} · CLOUD {(satellitePreview.cloud_cover * 100).toFixed(0)}%
          </p>
        )}
      </div>

      {hasTemporalData && temporalAnalysis && (
        <div style={{ borderTop: '1px solid var(--cb-border)' }}>
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp style={{ width: 10, height: 10, color: 'var(--cb-secondary)' }} />
              <span className="cb-label" style={{ fontFamily: 'monospace', letterSpacing: '0.08em', fontSize: 9 }}>NPV TRAJECTORY (2030–2050)</span>
            </div>
            <LineChart
              width={80}
              height={28}
              data={temporalAnalysis.history}
              margin={{ top: 2, right: 0, bottom: 2, left: 0 }}
            >
              <Line
                type="monotone"
                dataKey="npv"
                stroke="#eb796f"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </div>
          {temporalAnalysis.stranded_asset_year && (
            <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2" style={{ border: '1px solid var(--cb-border)', backgroundColor: 'var(--cb-surface)' }}>
              <AlertTriangle style={{ width: 10, height: 10, color: '#f43f5e', flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: '#f43f5e', fontFamily: 'monospace', letterSpacing: '0.03em' }}>
                PROJECTED NEGATIVE VALUE BY {temporalAnalysis.stranded_asset_year}
              </span>
            </div>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-black/95 overflow-hidden">
          {satellitePreview && (
            <img
              src={satellitePreview.thumbnail_url}
              alt="Satellite view of site – full screen"
              className="w-full h-full object-contain"
              style={{ filter: 'grayscale(100%)' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
