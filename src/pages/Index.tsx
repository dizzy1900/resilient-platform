import { useState, useCallback } from "react";
import { MapView, MapStyle } from "@/components/dashboard/MapView";
import { FloatingControlPanel, DashboardMode } from "@/components/hud/FloatingControlPanel";
import { SimulationPanel } from "@/components/hud/SimulationPanel";
import { toast } from "@/hooks/use-toast";

const mockMonthlyData = [
  { month: "Jan", value: 45 },
  { month: "Feb", value: 52 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 85 },
  { month: "May", value: 92 },
  { month: "Jun", value: 88 },
  { month: "Jul", value: 65 },
  { month: "Aug", value: 55 },
  { month: "Sep", value: 48 },
  { month: "Oct", value: 42 },
  { month: "Nov", value: 38 },
  { month: "Dec", value: 35 },
];

// API Endpoints
const COASTAL_API_URL = "https://web-production-8ff9e.up.railway.app/predict-coastal";
const FLOOD_API_URL = "https://web-production-8ff9e.up.railway.app/predict-flood";

const Index = () => {
  const [mode, setMode] = useState<DashboardMode>("agriculture");
  const [cropType, setCropType] = useState("maize");
  const [mangroveWidth, setMangroveWidth] = useState(100);
  const [propertyValue, setPropertyValue] = useState(500000);
  const [buildingValue, setBuildingValue] = useState(750000);
  const [greenRoofsEnabled, setGreenRoofsEnabled] = useState(false);
  const [permeablePavementEnabled, setPermeablePavementEnabled] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCoastalSimulating, setIsCoastalSimulating] = useState(false);
  const [isFloodSimulating, setIsFloodSimulating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showCoastalResults, setShowCoastalResults] = useState(false);
  const [showFloodResults, setShowFloodResults] = useState(false);
  const [temperature, setTemperature] = useState(1.5);

  const [results, setResults] = useState({
    avoidedLoss: 0,
    riskReduction: 0,
    yieldBaseline: 0,
    yieldResilient: 0,
    monthlyData: mockMonthlyData,
  });

  const [coastalResults, setCoastalResults] = useState<{
    avoidedLoss: number;
    slope: number | null;
    stormWave: number | null;
  }>({
    avoidedLoss: 0,
    slope: null,
    stormWave: null,
  });

  const [floodResults, setFloodResults] = useState({
    floodDepthReduction: 0,
    valueProtected: 0,
  });

  // Determine map style based on mode
  const mapStyle: MapStyle = mode === "coastal" ? "satellite" : mode === "flood" ? "flood" : "dark";
  const showFloodOverlay = mode === "flood" && markerPosition !== null;

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    setShowResults(false);
    setShowCoastalResults(false);
    setShowFloodResults(false);
  }, []);

  // Get active metric label based on mode
  const getActiveMetric = () => {
    switch (mode) {
      case 'agriculture':
        return `Crop Type: ${cropType.charAt(0).toUpperCase() + cropType.slice(1)}`;
      case 'coastal':
        return `Mangrove Width: ${mangroveWidth}m`;
      case 'flood':
        return `Flood Risk Analysis`;
    }
  };

  // Calculate resilience score based on temperature and mode
  const getResilienceScore = () => {
    const baseScore = Math.max(0, 100 - (temperature * 25));
    // Adjust based on mode-specific factors
    if (mode === 'flood' && (greenRoofsEnabled || permeablePavementEnabled)) {
      return Math.min(100, baseScore + 15);
    }
    if (mode === 'coastal' && mangroveWidth > 100) {
      return Math.min(100, baseScore + 10);
    }
    return baseScore;
  };

  const handleModeChange = useCallback((newMode: DashboardMode) => {
    setMode(newMode);
    setShowResults(false);
    setShowCoastalResults(false);
    setShowFloodResults(false);
  }, []);

  const handleTemperatureChange = useCallback((temp: number) => {
    setTemperature(temp);
  }, []);

  // Keep existing simulation handlers for future use
  const handleSimulate = useCallback(async () => {
    if (!markerPosition) return;

    setIsSimulating(true);
    setShowResults(false);

    try {
      const response = await fetch("https://primary-production-679e.up.railway.app/webhook/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: markerPosition.lat,
          lon: markerPosition.lng,
          crop: cropType,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const responseData = await response.json();

      const result = Array.isArray(responseData) ? responseData[0] : responseData;
      const analysis = result?.data?.analysis;
      const predictions = result?.data?.predictions;

      if (!analysis || !predictions) {
        throw new Error("Invalid response format from simulation API");
      }

      const yieldBaseline = predictions.standard_seed?.predicted_yield ?? 0;
      const yieldResilient = predictions.resilient_seed?.predicted_yield ?? 0;
      const avoidedLoss = analysis.avoided_loss ?? 0;
      const percentageImprovement = analysis.percentage_improvement ?? 0;

      setResults({
        avoidedLoss: Math.round(avoidedLoss * 100) / 100,
        riskReduction: Math.round(percentageImprovement * 100),
        yieldBaseline,
        yieldResilient,
        monthlyData: mockMonthlyData,
      });
      setShowResults(true);
    } catch (error) {
      console.error("Simulation failed:", error);
      toast({
        title: "Simulation Failed",
        description:
          error instanceof Error ? error.message : "Unable to connect to the simulation server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  }, [markerPosition, cropType]);

  const getInterventionType = useCallback(() => {
    const selectedToolkits: string[] = [
      ...(greenRoofsEnabled ? ["Install Green Roofs"] : []),
      ...(permeablePavementEnabled ? ["Permeable Pavement"] : []),
    ];

    if (!selectedToolkits || selectedToolkits.length === 0) {
      return "green_roof";
    }

    const toolkitsLower = selectedToolkits.map((t) => t.toLowerCase());

    if (toolkitsLower.some((t) => t.includes("green") && t.includes("roof"))) {
      return "green_roof";
    }

    if (toolkitsLower.some((t) => t.includes("permeable") || t.includes("pavement"))) {
      return "permeable_pavement";
    }

    return "green_roof";
  }, [greenRoofsEnabled, permeablePavementEnabled]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Full-screen Map Layer */}
      <div className="absolute inset-0">
        <MapView 
          onLocationSelect={handleLocationSelect} 
          markerPosition={markerPosition} 
          mapStyle={mapStyle}
          showFloodOverlay={showFloodOverlay}
        />
      </div>

      {/* Hex grid / gradient overlay for data density effect */}
      <div className="absolute inset-0 pointer-events-none hex-grid-overlay" />

      {/* HUD Panels */}
      
      {/* Top-Left: Floating Control Panel */}
      <div className="hud-panel hud-top-left">
        <FloatingControlPanel 
          mode={mode}
          onModeChange={handleModeChange}
          activeMetric={getActiveMetric()}
          coordinates={markerPosition}
        />
      </div>

      {/* Bottom-Left: Time Machine / Simulation Panel */}
      <div className="hud-panel hud-bottom-left">
        <SimulationPanel 
          onTemperatureChange={handleTemperatureChange}
          resilienceScore={getResilienceScore()}
        />
      </div>

      {/* Instruction overlay when no marker */}
      {!markerPosition && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="glass-panel px-6 py-4 text-center space-y-2">
            <p className="text-sm font-medium text-foreground">Click anywhere on the map to begin analysis</p>
            <p className="text-xs text-muted-foreground">Drop a pin to select your target location</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
