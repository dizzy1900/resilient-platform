import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

export interface RainfallChartData {
  month: string;
  historical: number;
  projected: number;
}

interface RainfallComparisonChartProps {
  data: RainfallChartData[];
  animateProjected?: boolean;
}

export const RainfallComparisonChart = ({ 
  data, 
  animateProjected = false 
}: RainfallComparisonChartProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Reset and animate when animateProjected changes or data changes
  useEffect(() => {
    if (animateProjected) {
      setAnimationProgress(0);
      const timer = setTimeout(() => setAnimationProgress(1), 50);
      return () => clearTimeout(timer);
    }
  }, [animateProjected, data]);

  // Animated data for projected bars
  const animatedData = useMemo(() => {
    if (!animateProjected || animationProgress === 1) return data;
    return data.map(d => ({
      ...d,
      projected: d.projected * animationProgress,
    }));
  }, [data, animateProjected, animationProgress]);

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={animatedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            label={{ 
              value: 'mm', 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.4)', fontSize: 10 }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            formatter={(value: number, name: string) => [
              `${Math.round(value)} mm`,
              name
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
            formatter={(value) => (
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>
            )}
          />
          <Bar
            dataKey="historical"
            name="Historical"
            fill="#3b82f6"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="projected"
            name="Projected"
            radius={[2, 2, 0, 0]}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {animatedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#f59e0b"
                style={{
                  transition: 'all 0.6s ease-out',
                }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
