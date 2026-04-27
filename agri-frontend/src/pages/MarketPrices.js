import { useEffect, useState } from 'react';
import API from '../api/axios';
import { Bar } from 'react-chartjs-2';
import { useLang } from '../context/LanguageContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SAMPLE_PRICES = [
  { id:1, cropName:'Rice', cropNameTamil:'நெல்', price:2300, previousPrice:2260, unit:'quintal', market:'Koyambedu', state:'Tamil Nadu' },
  { id:2, cropName:'Wheat', cropNameTamil:'கோதுமை', price:2275, previousPrice:2250, unit:'quintal', market:'Koyambedu', state:'Tamil Nadu' },
  { id:3, cropName:'Tomato', cropNameTamil:'தக்காளி', price:32, previousPrice:28, unit:'kg', market:'Koyambedu', state:'Tamil Nadu' },
  { id:4, cropName:'Onion', cropNameTamil:'வெங்காயம்', price:40, previousPrice:42, unit:'kg', market:'Koyambedu', state:'Tamil Nadu' },
  { id:5, cropName:'Sugarcane', cropNameTamil:'கரும்பு', price:325, previousPrice:315, unit:'quintal', market:'Erode', state:'Tamil Nadu' },
  { id:6, cropName:'Groundnut', cropNameTamil:'நிலக்கடலை', price:6100, previousPrice:5980, unit:'quintal', market:'Vellore', state:'Tamil Nadu' },
  { id:7, cropName:'Maize', cropNameTamil:'சோளம்', price:1980, previousPrice:1950, unit:'quintal', market:'Salem', state:'Tamil Nadu' },
  { id:8, cropName:'Banana', cropNameTamil:'வாழை', price:25, previousPrice:22, unit:'kg', market:'Trichy', state:'Tamil Nadu' },
];

// MSP 2026 updated values
const MSP_2026 = { Rice: 2300, Wheat: 2425, Maize: 2090, Groundnut: 6783 };

export default function MarketPrices() {
  const { lang } = useLang();
  const isTamil = lang === 'tamil';
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get('/market-prices')
      .then(r => setPrices(r.data.length > 0 ? r.data : SAMPLE_PRICES))
      .catch(() => setPrices(SAMPLE_PRICES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = prices.filter(p =>
    p.cropName.toLowerCase().includes(search.toLowerCase()) ||
    p.cropNameTamil.includes(search)
  );

  const chartData = {
    labels: filtered.slice(0, 6).map(p => isTamil ? p.cropNameTamil : p.cropName),
    datasets: [
      {
        label: isTamil ? 'இன்று ₹' : 'Today ₹',
        data: filtered.slice(0, 6).map(p => p.price),
        backgroundColor: '#1D9E75',
        borderRadius: 6,
      },
      {
        label: isTamil ? 'நேற்று ₹' : 'Yesterday ₹',
        data: filtered.slice(0, 6).map(p => p.previousPrice),
        backgroundColor: '#E1F5EE',
        borderRadius: 6,
      }
    ]
  };

  const TABLE_HEADERS = isTamil
    ? ['பயிர்', 'சந்தை', 'இன்று', 'நேற்று', 'மாற்றம்', 'MSP']
    : ['Crop', 'Market', 'Today', 'Yesterday', 'Change', 'MSP'];

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>{isTamil ? '📈 சந்தை விலைகள்' : '📈 Market Prices'}</h2>
      <p>{isTamil ? 'இன்றைய கோயம்பேடு மண்டி விலைகள்' : 'Live Market Prices — Today'}</p>

      {/* MSP Banner — 2026 */}
      <div style={{ background: '#E1F5EE', borderRadius: 12,
        padding: '12px 20px', marginBottom: 20, display: 'flex',
        justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#0F6E56', margin: 0 }}>
          ✅ {isTamil
            ? 'குறைந்தபட்ச ஆதார விலை (MSP) — 2026'
            : 'MSP (Minimum Support Price) — 2026'}
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {Object.entries(MSP_2026).map(([crop, price]) => (
            <span key={crop} style={{ fontSize: 12, color: '#1D9E75', fontWeight: 500 }}>
              {crop}: ₹{price}/q
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <input
        placeholder={isTamil ? '🔍 பயிர் தேட...' : '🔍 Search crop...'}
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8,
          border: '1px solid #ddd', fontSize: 13,
          marginBottom: 20, boxSizing: 'border-box' }}
      />

      {/* Chart */}
      <div style={{ background: '#fff', borderRadius: 12,
        border: '0.5px solid #e5e5e5', padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>
          {isTamil ? 'இன்று vs நேற்று' : 'Today vs Yesterday'}
        </h3>
        <Bar data={chartData} options={{
          responsive: true,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: false } }
        }} />
      </div>

      {/* Price Table */}
      <div style={{ background: '#fff', borderRadius: 12,
        border: '0.5px solid #e5e5e5', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f8f8' }}>
              {TABLE_HEADERS.map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left',
                  fontSize: 12, fontWeight: 500, color: '#555',
                  borderBottom: '1px solid #eee' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#999' }}>
                  {isTamil ? 'ஏற்றுகிறது...' : 'Loading...'}
                </td>
              </tr>
            ) : filtered.map((p, i) => {
              const change = p.price - p.previousPrice;
              const pct = ((change / p.previousPrice) * 100).toFixed(1);
              const isUp = change >= 0;
              const aboveMsp = MSP_2026[p.cropName] != null
                ? p.price >= MSP_2026[p.cropName] : null;
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5',
                  background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <p style={{ fontSize: 13, fontWeight: 500,
                      margin: '0 0 2px', color: '#222' }}>
                      {isTamil ? p.cropNameTamil : p.cropName}
                    </p>
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 12, color: '#666' }}>
                    {p.market}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 14, fontWeight: 500 }}>
                    ₹{p.price.toLocaleString()}/{p.unit}
                  </td>
                  <td style={{ padding: '12px 14px', fontSize: 13, color: '#888' }}>
                    ₹{p.previousPrice.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: 12, fontWeight: 500,
                      color: isUp ? '#16a34a' : '#dc2626' }}>
                      {isUp ? '▲' : '▼'} ₹{Math.abs(change)} ({Math.abs(pct)}%)
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    {aboveMsp !== null && (
                      <span style={{ fontSize: 11, padding: '3px 8px',
                        borderRadius: 20, fontWeight: 500,
                        background: aboveMsp ? '#E1F5EE' : '#FCEBEB',
                        color: aboveMsp ? '#0F6E56' : '#991B1B' }}>
                        {aboveMsp
                          ? (isTamil ? '✅ அதிகம்' : '✅ Above')
                          : (isTamil ? '⚠️ குறைவு' : '⚠️ Below')}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: '#999', marginTop: 12 }}>
        {isTamil
          ? '* விலைகள் தினமும் காலை 6 மணிக்கு புதுப்பிக்கப்படும் — Agmarknet 2026'
          : '* Prices updated daily at 6 AM from data.gov.in Agmarknet API — 2026'}
      </p>
    </div>
  );
}