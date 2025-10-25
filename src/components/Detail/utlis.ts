export function formatTime(sec: number) {
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  if (hours > 0) {
    return `${String(hours).padStart(1, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(
    2,
    '0'
  )}`;
}

export function formatPace(sec: number | null) {
  if (sec === null || sec <= 0 || sec > 1000 * 60) return '–'; // kalau tidak valid
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}/km`;
}

export function formatData(streams: Streams) {
  if (!streams?.heartrate) return [];

  const hr = streams.heartrate;
  const dist = streams.distance || [];
  const time = streams.time || [];
  const alt = streams.altitude || [];
  const cadence = streams.cadence || [];

  const len = Math.min(hr.length, dist.length, time.length);

  return Array.from({ length: len }, (_, i) => {
    const meters = dist[i] || 0;
    const seconds = time[i] || 0;

    const pace =
      meters > 0 ? Number((seconds / (meters / 1000)).toFixed(1)) : null;

    return {
      hr: hr[i],
      pace,
      alt: alt[i] ?? null,
      cadence: cadence[i] ?? null,
      t: seconds,
    };
  });
}

export interface Streams {
  heartrate?: StreamData;
  distance?: StreamData;
  time?: StreamData;
  altitude?: StreamData;
  cadence?: StreamData;
}

type StreamData = number[];

export interface ChartPoint {
  hr: number;
  pace: number | null;
  alt: number | null;
  cadence: number | null;
  t: number;
}
