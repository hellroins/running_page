import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
  Area,
  ReferenceArea,
} from 'recharts';
import {
  ChartPoint,
  formatData,
  formatPace,
  formatTime,
  Streams,
} from '../utlis';
import HRZoneStats from './HRZoneStats';

interface Props {
  streams: Streams;
  umur: number;
}

export default function HeartRateChart({ streams, umur }: Props) {
  const data: ChartPoint[] = useMemo(() => {
    return formatData(streams);
  }, [streams]);

  const userMaxHR = 220 - umur;
  const zones = [
    {
      min: 0.5 * userMaxHR,
      max: 0.6 * userMaxHR,
      label: 'Z1 Recovery',
      color: '#4caf50',
    },
    {
      min: 0.6 * userMaxHR,
      max: 0.7 * userMaxHR,
      label: 'Z2 Endurance',
      color: '#ffeb3b',
    },
    {
      min: 0.7 * userMaxHR,
      max: 0.8 * userMaxHR,
      label: 'Z3 Aerobic Base',
      color: '#ff9800',
    },
    {
      min: 0.8 * userMaxHR,
      max: 0.9 * userMaxHR,
      label: 'Z4 Hard Tempo',
      color: '#f44336',
    },
    {
      min: 0.9 * userMaxHR,
      max: 1.1 * userMaxHR,
      label: 'Z5 VO2 Max',
      color: '#9c27b0',
    },
  ];

  const zoneStats = useMemo(() => {
    const stats = zones.map((z) => ({ ...z, duration: 0 }));
    data.forEach((p, i) => {
      const dt = i < data.length - 1 ? data[i + 1].t - p.t : 1;
      const z = stats.find((z) => p.hr >= z.min && p.hr < z.max);
      if (z) z.duration += dt;
    });
    const total = stats.reduce((sum, z) => sum + z.duration, 0);
    return stats.map((z) => ({
      ...z,
      percent: total ? (z.duration / total) * 100 : 0,
    }));
  }, [data, zones]);

  return (
    <div style={{ padding: 16, borderRadius: 12 }}>
      <h2>Heart Rate</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
        >
          <defs>
            <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E53935" stopOpacity={1} />
              <stop offset="100%" stopColor="#B71C1C" stopOpacity={1} />
            </linearGradient>

            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF9A9A" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#FFEBEE" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* HR Zones */}
          {zones.map((z, i) => (
            <ReferenceArea
              key={i}
              y1={z.min}
              y2={z.max}
              fill={z.color}
              fillOpacity={0.3}
            />
          ))}

          <XAxis
            dataKey="t"
            type="number"
            domain={['dataMin', 'dataMax']}
            interval="preserveStartEnd"
            tickFormatter={(sec) => formatTime(sec)}
          />
          <YAxis domain={[0, 300]} />
          <Tooltip content={<CustomTooltip />} />

          {/* Area shading only */}
          <Area
            type="monotone"
            dataKey="hr"
            fill="url(#areaFill)"
            stroke="none"
            dot={false}
          />

          {/* Bold HR line */}
          <Line
            type="monotone"
            dataKey="hr"
            stroke="url(#hrGradient)"
            strokeWidth={4}
            dot={false}
            isAnimationActive={false}
          />

          <Brush dataKey="t" height={20} />
        </LineChart>
      </ResponsiveContainer>

      <HRZoneStats zoneStats={zoneStats} />
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const d = payload[0].payload;

  return (
    <div
      style={{
        background: '#222',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: 6,
        fontSize: 12,
      }}
    >
      <div>Time: {formatTime(d.t)}</div>
      <div>HR: {d.hr ?? '—'} bpm</div>
      <div>Pace: {formatPace(d.pace)}</div>
      <div>Altitude: {d.alt ?? '—'} m</div>
      <div>Cadence: {d.cadence ?? '—'} spm</div>
    </div>
  );
}
