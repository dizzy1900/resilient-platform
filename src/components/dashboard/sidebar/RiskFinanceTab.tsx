import { TrendingDown, DollarSign, BarChart2 } from 'lucide-react';

export const RiskFinanceTab = () => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Risk & Finance
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Run a simulation on the Overview tab to unlock detailed financial risk metrics and scenario analysis.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <TrendingDown className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Loss Exposure</p>
            <p className="text-xs text-muted-foreground mt-0.5">Annual expected loss under baseline and stress scenarios</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <DollarSign className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Green Bond Structuring</p>
            <p className="text-xs text-muted-foreground mt-0.5">Financing instrument sizing and coupon analysis</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <BarChart2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Temporal Analysis</p>
            <p className="text-xs text-muted-foreground mt-0.5">Multi-decade risk trajectory and cash flow projections</p>
          </div>
        </div>
      </div>
    </div>
  );
};
