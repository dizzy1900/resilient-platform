import { ModeSelector, DashboardMode } from '../ModeSelector';
import { CoordinatesDisplay } from '../CoordinatesDisplay';
import { CropSelector } from '../CropSelector';
import { MangroveSlider } from '../MangroveSlider';
import { PropertyValueInput } from '../PropertyValueInput';
import { SpongeCityToolkit } from '../SpongeCityToolkit';
import { SimulateButton } from '../SimulateButton';
import { ResultsCard } from '../ResultsCard';
import { CoastalResultsCard } from '../CoastalResultsCard';
import { FloodResultsCard } from '../FloodResultsCard';

interface OverviewTabProps {
  mode: DashboardMode;
  onModeChange: (mode: DashboardMode) => void;
  latitude: number | null;
  longitude: number | null;
  cropType: string;
  onCropChange: (value: string) => void;
  mangroveWidth: number;
  onMangroveWidthChange: (value: number) => void;
  onMangroveWidthChangeEnd: (value: number) => void;
  propertyValue: number;
  onPropertyValueChange: (value: number) => void;
  buildingValue: number;
  onBuildingValueChange: (value: number) => void;
  greenRoofsEnabled: boolean;
  onGreenRoofsChange: (enabled: boolean) => void;
  permeablePavementEnabled: boolean;
  onPermeablePavementChange: (enabled: boolean) => void;
  onFloodSimulate: () => void;
  isFloodSimulating: boolean;
  showFloodResults: boolean;
  floodResults: {
    floodDepthReduction: number;
    valueProtected: number;
  };
  onSimulate: () => void;
  isSimulating: boolean;
  showResults: boolean;
  results: {
    avoidedLoss: number;
    riskReduction: number;
    monthlyData: { month: string; value: number }[];
  };
  coastalResults: {
    avoidedLoss: number;
    slope: number | null;
    stormWave: number | null;
  };
  showCoastalResults: boolean;
  isCoastalSimulating: boolean;
}

export const OverviewTab = ({
  mode,
  onModeChange,
  latitude,
  longitude,
  cropType,
  onCropChange,
  mangroveWidth,
  onMangroveWidthChange,
  onMangroveWidthChangeEnd,
  propertyValue,
  onPropertyValueChange,
  buildingValue,
  onBuildingValueChange,
  greenRoofsEnabled,
  onGreenRoofsChange,
  permeablePavementEnabled,
  onPermeablePavementChange,
  onFloodSimulate,
  isFloodSimulating,
  showFloodResults,
  floodResults,
  onSimulate,
  isSimulating,
  showResults,
  results,
  coastalResults,
  showCoastalResults,
  isCoastalSimulating,
}: OverviewTabProps) => {
  const canSimulate = latitude !== null && longitude !== null;

  return (
    <div className="space-y-6">
      <ModeSelector value={mode} onChange={onModeChange} />
      <CoordinatesDisplay latitude={latitude} longitude={longitude} />

      {mode === 'agriculture' ? (
        <>
          <CropSelector value={cropType} onChange={onCropChange} />
          <SimulateButton
            onClick={onSimulate}
            isLoading={isSimulating}
            disabled={!canSimulate}
            mode="agriculture"
          />
          <ResultsCard
            visible={showResults}
            isLoading={isSimulating}
            avoidedLoss={results.avoidedLoss}
            riskReduction={results.riskReduction}
            monthlyData={results.monthlyData}
          />
        </>
      ) : mode === 'coastal' ? (
        <>
          <MangroveSlider
            value={mangroveWidth}
            onChange={onMangroveWidthChange}
            onChangeEnd={() => {}}
            disabled={!canSimulate}
          />
          <PropertyValueInput
            value={propertyValue}
            onChange={onPropertyValueChange}
            disabled={!canSimulate}
          />
          <SimulateButton
            onClick={() => onMangroveWidthChangeEnd(mangroveWidth)}
            isLoading={isCoastalSimulating}
            disabled={!canSimulate}
            label="Simulate Protection"
            mode="coastal"
          />
          <CoastalResultsCard
            visible={showCoastalResults}
            isLoading={isCoastalSimulating}
            avoidedLoss={coastalResults.avoidedLoss}
            slope={coastalResults.slope}
            stormWave={coastalResults.stormWave}
            mangroveWidth={mangroveWidth}
          />
        </>
      ) : (
        <>
          <SpongeCityToolkit
            buildingValue={buildingValue}
            onBuildingValueChange={onBuildingValueChange}
            greenRoofsEnabled={greenRoofsEnabled}
            onGreenRoofsChange={onGreenRoofsChange}
            permeablePavementEnabled={permeablePavementEnabled}
            onPermeablePavementChange={onPermeablePavementChange}
            disabled={!canSimulate}
          />
          <SimulateButton
            onClick={onFloodSimulate}
            isLoading={isFloodSimulating}
            disabled={!canSimulate}
            label="Simulate Flood Risk"
            mode="flood"
          />
          <FloodResultsCard
            visible={showFloodResults}
            isLoading={isFloodSimulating}
            floodDepthReduction={floodResults.floodDepthReduction}
            valueProtected={floodResults.valueProtected}
            greenRoofsEnabled={greenRoofsEnabled}
            permeablePavementEnabled={permeablePavementEnabled}
          />
        </>
      )}
    </div>
  );
};
