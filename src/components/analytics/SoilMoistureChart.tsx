import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

export interface SoilMoistureChartData {
  month: string;
  moisture: number;
}

interface SoilMoistureChartProps {
  data: SoilMoistureChartData[];
  wiltingPoint?: number;
}

const SUMMER_MONTHS = ['Jun', 'Jul', 'Aug'];

export const SoilMoistureChart = ({ 
  data, 
  wiltingPoint = 0.20 
}: SoilMoistureChartProps) => {
  // Check if moisture dips below wilting point during summer
  const hasSummerDepletion = useMemo(() => {
    return data.some(d => 
      SUMMER_MONTHS.includes(d.month) && d.moisture < wiltingPoint
    );
  }, [data, wiltingPoint]);

  // Normalize data to 0-1 scale if values are percentages (>1)
  const normalizedData = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.moisture));
    const isPercentage = maxValue > 1;
    
    return data.map(d => ({
      ...d,
      moisture: isPercentage ? d.moisture / 100 : d.moisture,
    }));
  }, [data]);

  const yDomain = [0, Math.max(0.6, ...normalizedData.map(d => d.moisture) )];

  return (
    <div className="w-full">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={normalizedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="moistureLineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              domain={yDomain}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Soil Moisture']}
            />
            {/* Wilting Point Reference Line */}
            <ReferenceLine
              y={wiltingPoint}
              stroke="#ef4444"
              strokeDasharray="6 4"
              strokeWidth={2}
              label={{
                value: 'Wilting Point',
                position: 'right',
                fill: '#ef4444',
                fontSize: 10,
                fontWeight: 500,
              }}
            />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Warning message for summer depletion */}
      {hasSummerDepletion && (
        <div className="mt-2 flex items-center gap-2 p-2 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400 font-medium">
            ⚠️ Critical moisture depletion in growing season.
          </span>
        </div>
      )}
    </div>
  );
};
