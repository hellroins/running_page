// components/Detail/HRZoneStats.tsx

import { useMemo } from 'react';

interface ZoneStat {
  label: string;
  color: string;
  duration: number;
  percent: number;
}

interface Props {
  zoneStats: ZoneStat[];
}

export default function HRZoneStats({ zoneStats }: Props) {
  const dominantZone = useMemo(() => {
    if (!zoneStats.length) return null;
    return zoneStats.reduce(
      (max, z) => (z.percent > max.percent ? z : max),
      zoneStats[0]
    );
  }, [zoneStats]);

  // Mapping effort label
  const effortLabel = useMemo(() => {
    if (!dominantZone) return '';
    switch (dominantZone.label) {
      case 'Z1 Recovery':
        return 'Easy / Recovery';
      case 'Z2 Endurance':
        return 'Endurance / Base';
      case 'Z3 Aerobic Base':
        return 'Solid Aerobic';
      case 'Z4 Hard Tempo':
        return 'Hard Tempo';
      case 'Z5 VO2 Max':
        return 'All-out / VO2 Max';
      default:
        return '';
    }
  }, [dominantZone]);

  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        background: '#fafafa',
        borderRadius: 12,
        color: 'black',
      }}
    >
      <h3>HR Zone Distribution</h3>
      {zoneStats.map((z) => (
        <div
          key={z.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div>
            <span style={{ color: z.color, fontWeight: 700 }}>■ </span>
            {z.label}
          </div>
          <div>{z.percent.toFixed(1)}%</div>
        </div>
      ))}

      <div style={{ marginTop: 8, fontWeight: 600 }}>
        Dominant Zone:{' '}
        <span style={{ color: dominantZone?.color }}>
          {dominantZone?.label}
        </span>
        — Effort: {effortLabel}
      </div>
    </div>
  );
}
