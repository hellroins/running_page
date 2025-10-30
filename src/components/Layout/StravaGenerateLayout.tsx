import html2canvas from 'html2canvas-pro';
import { useRef } from 'react';

interface Props {
  data: {
    distance: number;
    pace: string;
    calories: number;
    time: string;
    elevation: number;
    hrAvg: number;
  };
}

const StravaGenerateLayout = ({ data }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, {
      scale: 1,
      backgroundColor: '#000',
    });
    const link = document.createElement('a');
    link.download = 'strava_activity.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white">
      {/* Preview Area */}
      <div
        ref={cardRef}
        className="flex h-[1695px] w-[953px] flex-col items-center justify-center bg-black font-sans text-white"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header Logo */}
        <div className="mb-24 flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M3 2L15 22H9L3 2zM13 2L21 16H15L13 2z" />
          </svg>
          <h1 className="text-8xl font-extrabold tracking-tight">STRAVA</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-x-24 gap-y-16 text-center">
          {/* Jarak */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">Jarak</p>
            <p className="text-6xl font-bold">{data.distance.toFixed(2)} km</p>
          </div>

          {/* Pace */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">Pace</p>
            <p className="text-6xl font-bold">{data.pace} /km</p>
          </div>

          {/* Kalori */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">Kal</p>
            <p className="text-6xl font-bold">{data.calories} Kal</p>
          </div>

          {/* Waktu */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">Waktu</p>
            <p className="text-6xl font-bold">{data.time}</p>
          </div>

          {/* Elevasi */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">
              Kenaikan Elev
            </p>
            <p className="text-6xl font-bold">{data.elevation} m</p>
          </div>

          {/* HR Avg */}
          <div>
            <p className="mb-1 text-3xl font-medium text-gray-400">HR Rata²</p>
            <p className="text-6xl font-bold">{data.hrAvg} bpm</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="mt-8 rounded-lg bg-orange-500 px-6 py-3 text-lg font-semibold text-white hover:bg-orange-600"
      >
        Download PNG
      </button>
    </div>
  );
};

export default StravaGenerateLayout;
