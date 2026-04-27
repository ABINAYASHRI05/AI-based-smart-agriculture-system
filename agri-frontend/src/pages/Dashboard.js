import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [alerts,  setAlerts]  = useState([]);
  const [prices,  setPrices]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [time,    setTime]    = useState(new Date());
  const navigate  = useNavigate();
  const { lang }  = useLang();

  const name     = localStorage.getItem('agri_name')     || (lang === 'tamil' ? 'விவசாயி' : 'Farmer');
  const location = localStorage.getItem('agri_location') || 'Chennai';

  useEffect(function() {
    loadData();
    const timer = setInterval(function() {
      setTime(new Date());
    }, 1000);
    return function() { clearInterval(timer); };
  }, []);

  const loadData = async function() {
    setLoading(true);
    try {
      const res = await API.get('/weather?city=' + location);
      setWeather(res.data);
    } catch {
      setWeather({ temperature: 32, humidity: 75, description: lang === 'tamil' ? 'பகுதியளவு மேகமூட்டம்' : 'Partly Cloudy' });
    }
    try {
      const res = await API.get('/market-prices');
      setPrices(res.data.slice(0, 6));
    } catch { setPrices([]); }
    try {
      const res = await API.get('/alerts/user/1');
      setAlerts(res.data.slice(0, 3));
    } catch { setAlerts([]); }
    setLoading(false);
  };

  const greeting = function() {
    const h = new Date().getHours();
    if (lang === 'tamil') {
      if (h < 12) return 'காலை வணக்கம்';
      if (h < 17) return 'மதிய வணக்கம்';
      return 'மாலை வணக்கம்';
    } else {
      if (h < 12) return 'Good Morning';
      if (h < 17) return 'Good Afternoon';
      return 'Good Evening';
    }
  };

  const getWeatherIcon = function(desc) {
    if (!desc) return '🌤️';
    const d = desc.toLowerCase();
    if (d.includes('rain') || d.includes('மழை'))  return '🌧️';
    if (d.includes('cloud') || d.includes('மேகம')) return '⛅';
    if (d.includes('clear') || d.includes('தெளிவு')) return '☀️';
    if (d.includes('storm') || d.includes('புயல')) return '⛈️';
    return '🌤️';
  };

  const cards = [
    {
      icon: '🌡️',
      label: lang === 'tamil' ? 'வெப்பநிலை' : 'Temperature',
      sub:   lang === 'tamil' ? 'Temperature' : '',
      value: weather ? Math.round(weather.temperature) + '°C' : '--',
      bg: '#FFF7ED', border: '#F59E0B', text: '#92400E',
    },
    {
      icon: '💧',
      label: lang === 'tamil' ? 'ஈரப்பதம்' : 'Humidity',
      sub:   lang === 'tamil' ? 'Humidity' : '',
      value: weather ? weather.humidity + '%' : '--',
      bg: '#EFF6FF', border: '#3B82F6', text: '#1D4ED8',
    },
    {
      icon: '🌬️',
      label: lang === 'tamil' ? 'காற்று வேகம்' : 'Wind Speed',
      sub:   lang === 'tamil' ? 'Wind' : '',
      value: '18 km/h',
      bg: '#F0FDF4', border: '#1D9E75', text: '#0F6E56',
    },
    {
      icon: '🔔',
      label: lang === 'tamil' ? 'எச்சரிக்கை' : 'Alerts',
      sub:   lang === 'tamil' ? 'Alerts' : '',
      value: alerts.length,
      bg: '#FFF1F2', border: '#E24B4A', text: '#991B1B',
    },
  ];

  const actions = [
    {
      icon: '🛰️',
      label: lang === 'tamil' ? 'என் பண்ணை' : 'My Farm',
      path: '/satellite', bg: '#E1F5EE',
      border: '#1D9E75', text: '#0F6E56',
    },
    {
      icon: '🌱',
      label: lang === 'tamil' ? 'பயிர் பரிந்துரை' : 'Crop Advice',
      path: '/crop', bg: '#FEF3C7',
      border: '#B45309', text: '#92400E',
    },
    {
      icon: '🔬',
      label: lang === 'tamil' ? 'நோய் கண்டறிதல்' : 'Disease Check',
      path: '/disease', bg: '#FCEBEB',
      border: '#E24B4A', text: '#991B1B',
    },
    {
      icon: '📈',
      label: lang === 'tamil' ? 'சந்தை விலை' : 'Market Price',
      path: '/market', bg: '#EFF6FF',
      border: '#1D4ED8', text: '#1D4ED8',
    },
    {
      icon: '🏛️',
      label: lang === 'tamil' ? 'அரசு மானியம்' : 'Subsidies',
      path: '/subsidies', bg: '#EEEDFE',
      border: '#6D28D9', text: '#4C1D95',
    },
  ];

  const tips = [
    {
      icon: '💧',
      text: lang === 'tamil' ? 'காலை நேர நீர்ப்பாசனம் சிறந்தது' : 'Morning irrigation gives best results',
      sub:  lang === 'tamil' ? 'நீர் வீண் ஆவாது' : 'Reduces water waste',
    },
    {
      icon: '🌿',
      text: lang === 'tamil' ? 'வேப்ப எண்ணெய் தெளித்து பூச்சி விரட்டுங்கள்' : 'Spray neem oil for natural pest control',
      sub:  lang === 'tamil' ? 'இயற்கை முறை' : 'No chemicals needed',
    },
    {
      icon: '🌱',
      text: lang === 'tamil' ? 'மண்புழு உரம் மண் வளம் அதிகரிக்கும்' : 'Vermicompost improves soil fertility',
      sub:  lang === 'tamil' ? '40% வளம் அதிகரிக்கும்' : 'Increases yield by 40%',
    },
    {
      icon: '☀️',
      text: lang === 'tamil' ? 'அறுவடை காலத்தில் சூரிய ஒளி முக்கியம்' : 'Sunlight is crucial at harvest time',
      sub:  lang === 'tamil' ? 'தரமான மகசூல் கிடைக்கும்' : 'Ensures quality harvest',
    },
  ];

  const chartData = {
    labels: prices.map(function(p) {
      return lang === 'tamil'
        ? (p.cropNameTamil || p.cropName)
        : p.cropName;
    }),
    datasets: [{
      label: lang === 'tamil' ? 'விலை (₹)' : 'Price (₹)',
      data: prices.map(function(p) { return p.price || 0; }),
      backgroundColor: ['#1D9E75','#3B82F6','#F59E0B','#EF4444','#8B5CF6','#EC4899'],
      borderRadius: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false }, x: { grid: { display: false } } }
  };

  if (loading) {
    return (
      <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <div style={{ fontSize:56 }}>🌾</div>
        <p style={{ fontSize:18, color:'#1D9E75', fontWeight:500 }}>
          {lang === 'tamil' ? 'தரவு ஏற்றுகிறோம்...' : 'Loading your farm data...'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F0FDF4', padding:'20px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* ── HERO ─────────────────────────────────── */}
        <div style={{
          background:'linear-gradient(135deg,#1D9E75,#0F6E56)',
          borderRadius:20, padding:'28px 32px',
          marginBottom:24, color:'#fff',
          display:'flex', justifyContent:'space-between',
          alignItems:'center', flexWrap:'wrap', gap:16,
        }}>
          <div>
            <p style={{ fontSize:13, opacity:0.85, margin:'0 0 4px' }}>
              {greeting()}
            </p>
            <h1 style={{ fontSize:28, fontWeight:500, margin:'0 0 6px', color:'#fff' }}>
              {name} 👨‍🌾
            </h1>
            <p style={{ fontSize:14, opacity:0.85, margin:0 }}>
              📍 {location} &nbsp;|&nbsp;
              {lang === 'tamil'
                ? time.toLocaleDateString('ta-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
                : time.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
              }
            </p>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:64, lineHeight:1, marginBottom:4 }}>
              {getWeatherIcon(weather && weather.description)}
            </div>
            <p style={{ fontSize:32, fontWeight:500, margin:0, color:'#fff' }}>
              {weather ? Math.round(weather.temperature) + '°C' : '--°C'}
            </p>
            <p style={{ fontSize:12, opacity:0.8, margin:'2px 0 0', textTransform:'capitalize' }}>
              {weather
                ? (lang === 'tamil' ? 'பகுதியளவு மேகமூட்டம்' : weather.description)
                : (lang === 'tamil' ? 'ஏற்றுகிறது...' : 'Loading...')}
            </p>
          </div>
        </div>

        {/* ── WEATHER CARDS ────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
          {cards.map(function(card, i) {
            return (
              <div key={i} style={{
                background:card.bg, borderRadius:16,
                padding:'18px 20px',
                border:'1.5px solid ' + card.border,
                display:'flex', alignItems:'center', gap:14,
              }}>
                <div style={{ fontSize:32, lineHeight:1, flexShrink:0 }}>{card.icon}</div>
                <div>
                  <p style={{ fontSize:11, color:card.text, margin:'0 0 2px', fontWeight:500 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize:22, fontWeight:500, color:card.text, margin:0 }}>
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── QUICK ACTIONS ────────────────────────── */}
        <div style={{
          background:'#fff', borderRadius:20,
          padding:'20px 24px', marginBottom:24,
          border:'0.5px solid #e5e5e5',
        }}>
          <h3 style={{ fontSize:15, fontWeight:500, color:'#1D9E75', margin:'0 0 16px' }}>
            ⚡ {lang === 'tamil' ? 'விரைவு செயல்கள்' : 'Quick Actions'}
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {actions.map(function(a, i) {
              return (
                <div key={i}
                  onClick={function() { navigate(a.path); }}
                  style={{
                    background:a.bg,
                    border:'1.5px solid ' + a.border,
                    borderRadius:14, padding:'18px 12px',
                    cursor:'pointer', textAlign:'center',
                  }}
                  onMouseEnter={function(e) { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={function(e) { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize:32, marginBottom:8 }}>{a.icon}</div>
                  <p style={{ fontSize:12, fontWeight:500, color:a.text, margin:0 }}>
                    {a.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CHART + ALERTS ───────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20, marginBottom:24 }}>

          <div style={{ background:'#fff', borderRadius:20, border:'0.5px solid #e5e5e5', padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ fontSize:15, fontWeight:500, color:'#222', margin:0 }}>
                📈 {lang === 'tamil' ? 'இன்றைய சந்தை விலை' : "Today's Market Prices"}
              </h3>
              <span style={{ fontSize:11, color:'#1D9E75', background:'#E1F5EE', padding:'3px 10px', borderRadius:20, fontWeight:500 }}>
                {lang === 'tamil' ? 'நேரடி விலை' : 'Live prices'}
              </span>
            </div>
            {prices.length > 0
              ? <Bar data={chartData} options={chartOptions} />
              : <div style={{ textAlign:'center', padding:'40px 0', color:'#999' }}>
                  <p style={{ fontSize:36 }}>📊</p>
                  <p style={{ fontSize:13, marginTop:8 }}>
                    {lang === 'tamil' ? 'விலை தரவு இல்லை' : 'No price data available'}
                  </p>
                </div>
            }
          </div>

          <div style={{ background:'#fff', borderRadius:20, border:'0.5px solid #e5e5e5', padding:24 }}>
            <h3 style={{ fontSize:15, fontWeight:500, color:'#222', margin:'0 0 20px' }}>
              🔔 {lang === 'tamil' ? 'எச்சரிக்கைகள்' : 'Alerts'}
            </h3>
            {alerts.length === 0
              ? <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <p style={{ fontSize:48 }}>✅</p>
                  <p style={{ color:'#1D9E75', fontSize:14, fontWeight:500, marginTop:12 }}>
                    {lang === 'tamil' ? 'எச்சரிக்கைகள் இல்லை' : 'No alerts right now'}
                  </p>
                </div>
              : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {alerts.map(function(alert, i) {
                    const color = alert.type==='DANGER' ? '#E24B4A' : alert.type==='WARNING' ? '#BA7517' : '#1D9E75';
                    const bg    = alert.type==='DANGER' ? '#FCEBEB' : alert.type==='WARNING' ? '#FAEEDA' : '#E1F5EE';
                    return (
                      <div key={i} style={{ background:bg, borderRadius:12, padding:'12px 14px', borderLeft:'3px solid '+color }}>
                        <p style={{ fontSize:13, fontWeight:500, color:'#222', margin:'0 0 2px' }}>
                          {lang === 'tamil' ? (alert.titleTamil || alert.title) : alert.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
            }
          </div>
        </div>

        {/* ── FARMING TIPS ─────────────────────────── */}
        <div style={{ background:'#fff', borderRadius:20, border:'0.5px solid #e5e5e5', padding:'20px 24px', marginBottom:24 }}>
          <h3 style={{ fontSize:15, fontWeight:500, color:'#222', margin:'0 0 16px' }}>
            💡 {lang === 'tamil' ? 'இன்றைய விவசாய குறிப்புகள்' : "Today's Farming Tips"}
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {tips.map(function(tip, i) {
              return (
                <div key={i} style={{ background:'#F0FDF4', borderRadius:12, padding:'14px 16px', border:'0.5px solid #9FE1CB' }}>
                  <div style={{ fontSize:24, marginBottom:8 }}>{tip.icon}</div>
                  <p style={{ fontSize:12, fontWeight:500, color:'#0F6E56', margin:'0 0 4px', lineHeight:1.5 }}>{tip.text}</p>
                  <p style={{ fontSize:11, color:'#1D9E75', margin:0 }}>{tip.sub}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── PRICE TABLE ──────────────────────────── */}
        {prices.length > 0 && (
          <div style={{ background:'#fff', borderRadius:20, border:'0.5px solid #e5e5e5', padding:'20px 24px' }}>
            <h3 style={{ fontSize:15, fontWeight:500, color:'#222', margin:'0 0 16px' }}>
              🛒 {lang === 'tamil' ? 'விலை பட்டியல்' : 'Price List — Today'}
            </h3>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F0FDF4' }}>
                  {[
                    lang==='tamil' ? 'பயிர்'   : 'Crop',
                    lang==='tamil' ? 'சந்தை'   : 'Market',
                    lang==='tamil' ? 'இன்று'   : 'Today',
                    lang==='tamil' ? 'நேற்று'  : 'Yesterday',
                    lang==='tamil' ? 'மாற்றம்' : 'Change',
                  ].map(function(h, i) {
                    return (
                      <th key={i} style={{ padding:'10px 14px', textAlign: i>1?'right':'left', fontSize:12, fontWeight:500, color:'#1D9E75', borderBottom:'1px solid #e5e5e5' }}>
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {prices.map(function(p, i) {
                  const change = (p.price||0) - (p.previousPrice||0);
                  const pct    = p.previousPrice ? ((change/p.previousPrice)*100).toFixed(1) : '0.0';
                  const isUp   = change >= 0;
                  return (
                    <tr key={i} style={{ borderBottom:'0.5px solid #f0f0f0', background: i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ padding:'10px 14px' }}>
                        <p style={{ fontSize:13, fontWeight:500, margin:'0 0 2px', color:'#222' }}>
                          {lang==='tamil' ? (p.cropNameTamil||p.cropName) : p.cropName}
                        </p>
                      </td>
                      <td style={{ padding:'10px 14px', fontSize:12, color:'#666' }}>{p.market}</td>
                      <td style={{ padding:'10px 14px', textAlign:'right', fontWeight:500, fontSize:14 }}>
                        ₹{(p.price||0).toLocaleString()}/{p.unit}
                      </td>
                      <td style={{ padding:'10px 14px', textAlign:'right', fontSize:12, color:'#888' }}>
                        ₹{(p.previousPrice||0).toLocaleString()}
                      </td>
                      <td style={{ padding:'10px 14px', textAlign:'right' }}>
                        <span style={{ fontSize:12, fontWeight:500, color: isUp?'#16a34a':'#dc2626', background: isUp?'#f0fdf4':'#fff1f2', padding:'3px 8px', borderRadius:20 }}>
                          {isUp?'▲':'▼'} {Math.abs(pct)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}