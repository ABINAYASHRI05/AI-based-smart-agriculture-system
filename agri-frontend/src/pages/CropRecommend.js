import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

const TN_SOIL_DATA = {
  'Chennai':      { nitrogen: 85,  phosphorus: 40, potassium: 45, ph: 6.8 },
  'Coimbatore':   { nitrogen: 92,  phosphorus: 48, potassium: 52, ph: 6.5 },
  'Madurai':      { nitrogen: 78,  phosphorus: 35, potassium: 40, ph: 7.1 },
  'Salem':        { nitrogen: 88,  phosphorus: 42, potassium: 48, ph: 6.6 },
  'Trichy':       { nitrogen: 95,  phosphorus: 50, potassium: 55, ph: 6.3 },
  'Tirunelveli':  { nitrogen: 75,  phosphorus: 32, potassium: 38, ph: 7.3 },
  'Erode':        { nitrogen: 90,  phosphorus: 45, potassium: 50, ph: 6.4 },
  'Vellore':      { nitrogen: 82,  phosphorus: 38, potassium: 43, ph: 6.9 },
  'Thanjavur':    { nitrogen: 98,  phosphorus: 55, potassium: 58, ph: 6.1 },
  'Pollachi':     { nitrogen: 93,  phosphorus: 47, potassium: 53, ph: 6.4 },
  'Tiruppur':     { nitrogen: 80,  phosphorus: 37, potassium: 42, ph: 7.0 },
  'Dindigul':     { nitrogen: 76,  phosphorus: 33, potassium: 39, ph: 7.2 },
  'Default':      { nitrogen: 87,  phosphorus: 42, potassium: 47, ph: 6.7 },
};

export default function CropRecommend() {
  const [weather,    setWeather]   = useState(null);
  const [soilData,   setSoilData]  = useState(null);
  const [result,     setResult]    = useState(null);
  const [loading,    setLoading]   = useState(false);
  const [fetching,   setFetching]  = useState(false);
  const [error,      setError]     = useState('');
  const [autoFilled, setAutoFilled] = useState(false);
  const { lang } = useLang();
  const isTamil = lang === 'tamil';

  const userLocation = localStorage.getItem('agri_location') || 'Chennai';

  useEffect(() => {
    autoFetchData();
  }, []);

  const autoFetchData = async () => {
    setFetching(true);
    setError('');
    try {
      const weatherRes = await API.get(`/weather?city=${userLocation}`);
      const w = weatherRes.data;
      setWeather(w);
      const city = userLocation.split(',')[0].trim();
      const soil = TN_SOIL_DATA[city] || TN_SOIL_DATA['Default'];
      setSoilData(soil);
      setAutoFilled(true);
    } catch (err) {
      setWeather({ temperature: 28, humidity: 75, description: 'partly cloudy' });
      const soil = TN_SOIL_DATA[userLocation] || TN_SOIL_DATA['Default'];
      setSoilData(soil);
      setAutoFilled(true);
    }
    setFetching(false);
  };

  const handleGetRecommendation = async () => {
    if (!soilData || !weather) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        nitrogen:    soilData.nitrogen,
        phosphorus:  soilData.phosphorus,
        potassium:   soilData.potassium,
        temperature: weather.temperature,
        humidity:    weather.humidity,
        ph:          soilData.ph,
        rainfall:    120,
      };
      const res = await API.post('/crop/recommend', payload);
      setResult(res.data.recommendations);
    } catch (err) {
      setError(isTamil
        ? 'ML சேவை இயங்கவில்லை. Python Flask port 5000-ல் தொடங்கவும்.'
        : 'ML service not running. Start Python Flask on port 5000.');
    }
    setLoading(false);
  };

  const colorMap = ['#1D9E75', '#3B82F6', '#888780'];

  const weatherCards = [
    {
      label: isTamil ? 'வெப்பம்'   : 'Temperature',
      val:   `${Math.round(weather?.temperature ?? 0)}°C`,
      sub:   isTamil ? 'Temperature' : 'வெப்பநிலை',
    },
    {
      label: isTamil ? 'ஈரப்பதம்' : 'Humidity',
      val:   `${weather?.humidity ?? 0}%`,
      sub:   isTamil ? 'Humidity' : 'ஈரப்பதம்',
    },
    {
      label: isTamil ? 'வானிலை'   : 'Weather',
      val:   weather?.description ?? '-',
      sub:   isTamil ? 'Weather' : 'வானிலை',
    },
    {
      label: isTamil ? 'pH அளவு'  : 'Soil pH',
      val:   soilData?.ph ?? '-',
      sub:   isTamil ? 'Soil pH' : 'மண் pH',
    },
  ];

  const nutrientCards = [
    { label: isTamil ? 'நைட்ரஜன் (N)'   : 'Nitrogen (N)',   val: soilData?.nitrogen,   unit: 'kg/ha' },
    { label: isTamil ? 'பாஸ்பரஸ் (P)'   : 'Phosphorus (P)', val: soilData?.phosphorus, unit: 'kg/ha' },
    { label: isTamil ? 'பொட்டாசியம் (K)': 'Potassium (K)',  val: soilData?.potassium,  unit: 'kg/ha' },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>

      {/* Page Title */}
      <h2>{isTamil ? '🌱 பயிர் பரிந்துரை' : '🌱 Crop Recommendation'}</h2>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>
        {isTamil
          ? 'உங்கள் மண் மற்றும் வானிலையின் படி சிறந்த பயிரை தேர்ந்தெடுங்கள்'
          : 'Get the best crop suggestion based on your soil and weather'}
      </p>

      {/* Fetching Loader */}
      {fetching && (
        <div style={{ background: '#EFF6FF', borderRadius: 12,
          padding: 20, textAlign: 'center', marginBottom: 20 }}>
          <p style={{ color: '#1D4ED8', fontSize: 14, margin: 0 }}>
            ⏳ {isTamil
              ? `உங்கள் இடத்தின் தரவை பெறுகிறோம்... (${userLocation})`
              : `Fetching weather and soil data for ${userLocation}...`}
          </p>
        </div>
      )}

      {autoFilled && weather && soilData && (
        <>
          {/* Weather Card */}
          <div style={{ background: '#E1F5EE', borderRadius: 12,
            padding: 16, marginBottom: 14, border: '0.5px solid #9FE1CB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 500,
                color: '#0F6E56', margin: 0 }}>
                📍 {userLocation} —{' '}
                {isTamil ? 'தானியங்கி தரவு' : 'Auto-fetched data'}
              </p>
              <button onClick={autoFetchData}
                style={{ fontSize: 11, padding: '4px 12px',
                  background: '#1D9E75', color: '#fff',
                  border: 'none', borderRadius: 20, cursor: 'pointer' }}>
                🔄 {isTamil ? 'புதுப்பி' : 'Refresh'}
              </button>
            </div>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {weatherCards.map((item, i) => (
                <div key={i} style={{ background: '#fff',
                  borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#555',
                    margin: '0 0 4px' }}>{item.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 500,
                    color: '#1D9E75', margin: '0 0 2px',
                    wordBreak: 'break-word' }}>{item.val}</p>
                  <p style={{ fontSize: 10, color: '#999',
                    margin: 0 }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Nutrients Card */}
          <div style={{ background: '#FEF3C7', borderRadius: 12,
            padding: 16, marginBottom: 20, border: '0.5px solid #FCD34D' }}>
            <p style={{ fontSize: 13, fontWeight: 500,
              color: '#92400E', margin: '0 0 10px' }}>
              🌍 {isTamil ? 'மண் ஊட்டச்சத்து' : 'Soil Nutrients'}
              <span style={{ fontSize: 11, fontWeight: 400,
                marginLeft: 8, color: '#B45309' }}>
                ({isTamil
                  ? `${userLocation} க்கு தானியங்கி கண்டறிவு`
                  : `Auto-detected for ${userLocation}`})
              </span>
            </p>
            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {nutrientCards.map((item, i) => (
                <div key={i} style={{ background: '#fff',
                  borderRadius: 8, padding: 10, textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: '#666',
                    margin: '0 0 4px' }}>{item.label}</p>
                  <p style={{ fontSize: 16, fontWeight: 500,
                    color: '#B45309', margin: '0 0 2px' }}>{item.val}</p>
                  <p style={{ fontSize: 10, color: '#999',
                    margin: 0 }}>{item.unit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommend Button */}
          <button onClick={handleGetRecommendation} disabled={loading}
            style={{ width: '100%', padding: 14,
              background: loading ? '#9CA3AF' : '#1D9E75',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 16 }}>
            {loading
              ? (isTamil ? '⏳ AI பகுப்பாய்வு செய்கிறது...' : '⏳ AI is analyzing...')
              : (isTamil ? '🔍 பயிர் பரிந்துரை பெறுக' : '🔍 Get Crop Recommendation')}
          </button>
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: '#FCEBEB', borderRadius: 10,
          padding: 14, marginBottom: 16 }}>
          <p style={{ color: '#991B1B', fontSize: 13, margin: 0 }}>❌ {error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ background: '#fff', borderRadius: 12,
          border: '0.5px solid #e5e5e5', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
            ✅ {isTamil
              ? 'உங்களுக்கான சிறந்த பயிர்கள்'
              : 'Best Crops for You'}
          </h3>

          {result.map((r, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex',
                justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 500,
                    textTransform: 'capitalize' }}>{r.crop}</span>
                  {i === 0 && (
                    <span style={{ background: '#E1F5EE', color: '#0F6E56',
                      fontSize: 11, padding: '2px 8px', borderRadius: 20,
                      fontWeight: 500 }}>
                      ⭐ {isTamil ? 'சிறந்தது' : 'Best Match'}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500,
                  color: colorMap[i] }}>{r.confidence}%</span>
              </div>
              <div style={{ height: 10, background: '#f0f0f0',
                borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${r.confidence}%`, height: '100%',
                  borderRadius: 5, background: colorMap[i],
                  transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}

          {/* Tip box */}
          <div style={{ background: '#E1F5EE', borderRadius: 8,
            padding: 12, marginTop: 8 }}>
            <p style={{ fontSize: 12, color: '#0F6E56', margin: 0 }}>
              💡 {isTamil
                ? <>உங்கள் {userLocation} மண் மற்றும் தற்போதைய வானிலையின் படி{' '}
                    <strong>{result[0]?.crop.toUpperCase()}</strong>{' '}
                    சிறந்தது. உள்ளூர் வேளாண் அலுவலரை தொடர்பு கொள்ளுங்கள்.</>
                : <>Based on <strong>{userLocation}</strong> soil and current weather,{' '}
                    <strong>{result[0]?.crop.toUpperCase()}</strong>{' '}
                    is the best fit. Contact your local agriculture officer for guidance.</>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}