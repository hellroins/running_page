import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeartRateChart from '@/components/Detail/HeartRate/HeartRateChart';
import DetailActivity from '@/components/Detail/Activity';

export default function DetailPage() {
  const { id } = useParams();
  const [stream, setStream] = useState<any>(null);

  const [umur, setUmur] = useState(0);

  useEffect(() => {
    const tanggalLahir = new Date('1997-01-01');
    const hariIni = new Date();

    let usia = hariIni.getFullYear() - tanggalLahir.getFullYear();
    const bulan = hariIni.getMonth() - tanggalLahir.getMonth();
    const hari = hariIni.getDate() - tanggalLahir.getDate();

    if (bulan < 0 || (bulan === 0 && hari < 0)) {
      usia--;
    }

    setUmur(usia);
  }, []);

  useEffect(() => {
    fetch(`/static/activity_streams/${id}.json`)
      .then((res) => res.json())
      .then((data) => setStream(data));
  }, [id]);

  if (!stream) return <div>Loading...</div>;

  return (
    <div className="activity-detail">
      <h1>Activity {id}</h1>

      <section id="detail">
        <DetailActivity id={id ? parseInt(id) : null} />
      </section>
      <section id="map">[Map coming soon]</section>

      <section id="heart-rate-chart">
        <HeartRateChart streams={stream} umur={umur} />
      </section>

      <section id="pace-splits-chart">[Pace Splits]</section>

      <section id="altitude-chart">[Altitude Chart]</section>

      <section id="cadence-chart">[Cadence Chart]</section>

      <section id="hr-zone">[HR Zone Stats]</section>
    </div>
  );
}
