import { Leaf, Shield, Globe } from 'lucide-react';

export const AdaptationTab = () => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Adaptation Portfolio
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Run a simulation on the Overview tab to explore nature-based and engineered adaptation solutions for your selected location.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Leaf className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Nature-Based Solutions</p>
            <p className="text-xs text-muted-foreground mt-0.5">Mangroves, wetlands, green corridors and urban forestry</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Shield className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Defensive Infrastructure</p>
            <p className="text-xs text-muted-foreground mt-0.5">Seawalls, levees, sponge city and drainage upgrades</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <Globe className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">Market Intelligence</p>
            <p className="text-xs text-muted-foreground mt-0.5">Regional climate finance and ecosystem service valuations</p>
          </div>
        </div>
      </div>
    </div>
  );
};
