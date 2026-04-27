import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

export default function SatelliteFarm() {
  const [data,        setData]        = useState(null);
  const [calendar,    setCalendar]    = useState([]);
  const [organicTips, setOrganicTips] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('calendar');
  const [activeSeason,setActiveSeason]= useState('kharif');
  const { lang } = useLang();

  const location = localStorage.getItem('agri_location') || 'Chennai';

  useEffect(function() { fetchData(); }, []);

  // ── Normalize one calendar month from backend ──────────────
  // Backend keys: month, icon, actionTamil, actionEnglish,
  //               organicTip, cropsEnglish, cropsTamil, stage
  const normalizeMonth = function(m, season) {
    return {
      month:       m.month       || '',
      monthTamil:  m.monthTamil  || m.month || '',
      icon:        m.icon        || '🌾',
      weatherIcon: m.weatherIcon || '🌤️',
      season:      season,
      crops:       m.cropsEnglish || m.crops   || '',
      cropsTamil:  m.cropsTamil   || '',
      action:      m.actionEnglish|| m.action  || '',
      actionTamil: m.actionTamil  || '',
      tip:         m.organicTip   || m.tip     || '',
      tipTamil:    m.organicTip   || m.tipTamil|| '',
    };
  };

  // ── Normalize one organic tip from backend ─────────────────
  // Backend keys: nameTamil, nameEnglish, descTamil, descEnglish
  // NO benefit field — backend doesn't send one
  const normalizeTip = function(t) {
    return {
      icon:         t.icon         || '🌿',
      name:         t.nameEnglish  || t.name  || '',
      nameTamil:    t.nameTamil    || t.name  || '',
      desc:         t.descEnglish  || t.desc  || '',
      descTamil:    t.descTamil    || t.desc  || '',
      benefit:      t.benefit      || '',
      benefitTamil: t.benefitTamil || '',
    };
  };

  const fetchData = async function() {
    setLoading(true);
    try {
      const res = await API.get(
        '/satellite/farming-calendar?location=' + location);
      const d = res.data;

      // Satellite metrics come from soil-data endpoint,
      // but farming-calendar doesn't return them — use defaults
      setData({
        ndvi:        d.ndvi        || 0.45,
        soilHealth:  d.soilHealth  || 'GOOD',
        cropStage:   d.cropGrowthStage || 'Active growth',
        temperature: d.temperature || 32,
      });

      // Backend returns kharif/rabi/summer separately — merge them
      const kharif = (d.kharif  || []).map(function(m) { return normalizeMonth(m, 'kharif'); });
      const rabi   = (d.rabi    || []).map(function(m) { return normalizeMonth(m, 'rabi');   });
      const summer = (d.summer  || []).map(function(m) { return normalizeMonth(m, 'summer'); });
      setCalendar([...kharif, ...rabi, ...summer]);

      // Normalize organic tips
      const rawTips = d.organicTips || [];
      setOrganicTips(rawTips.map(normalizeTip));

    } catch (err) {
      console.error('API error, using defaults:', err);
      setData({ ndvi: 0.35, soilHealth: 'MODERATE', cropStage: 'Early growth', temperature: 32 });
      setCalendar(defaultCalendar());
      setOrganicTips(defaultTips());
    }
    setLoading(false);
  };

  const T = {
    title:      lang==='tamil' ? 'செயற்கைக்கோள் பண்ணை பகுப்பாய்வு' : 'Satellite Farm Analysis',
    subtitle:   lang==='tamil' ? `செயற்கைக்கோள் பண்ணை பகுப்பாய்வு — ${location}` : `Satellite Farm Analysis — ${location}`,
    refresh:    lang==='tamil' ? '🔄 புதுப்பிக்க / Refresh' : '🔄 Refresh',
    ndvi:       lang==='tamil' ? 'NDVI மதிப்பு'   : 'NDVI Value',
    soil:       lang==='tamil' ? 'மண் ஆரோக்கியம்' : 'Soil Health',
    cropStage:  lang==='tamil' ? 'பயிர் நிலை'     : 'Crop Stage',
    temp:       lang==='tamil' ? 'வெப்பநிலை'       : 'Temperature',
    vegIndex:   lang==='tamil' ? 'தாவர குறியீடு'   : 'Vegetation Index',
    calTab:     lang==='tamil' ? '📅 பயிர் நாட்காட்டி / Crop Calendar' : '📅 Crop Calendar',
    orgTab:     lang==='tamil' ? '🌿 இயற்கை விவசாயம் / Organic Tips'  : '🌿 Organic Tips',
    nextSow:    lang==='tamil' ? '📅 அடுத்த விதைப்பு நேரம்' : '📅 Next Sowing Window',
    nextSowSub: lang==='tamil' ? 'June 1 — Kharif season / நெல் விதைப்பு தொடங்கும்' : 'June 1 — Kharif season begins — Rice sowing starts',
    listen:     lang==='tamil' ? '🔊 கேளு' : '🔊 Listen',
    kharif:     lang==='tamil' ? '☁️ கரீஃப்' : '☁️ Kharif',
    rabi:       lang==='tamil' ? '❄️ ரபி'   : '❄️ Rabi',
    summer:     lang==='tamil' ? '☀️ கோடை'  : '☀️ Summer',
    loading:    lang==='tamil' ? '🛰️ செயற்கைக்கோள் தரவு பெறுகிறோம்...' : '🛰️ Fetching satellite data...',
    moderate:   lang==='tamil' ? 'சாதாரணம்'   : 'Moderate',
    good:       lang==='tamil' ? 'நல்லது'     : 'Good',
    excellent:  lang==='tamil' ? 'மிகவும் நல்லது' : 'Excellent',
    poor:       lang==='tamil' ? 'மோசம்'     : 'Poor',
  };

  const getColor = function(health) {
    if (!health) return '#888';
    const h = health.toUpperCase();
    if (h === 'EXCELLENT') return '#15803d';
    if (h === 'GOOD')      return '#16a34a';
    if (h === 'MODERATE')  return '#B45309';
    if (h === 'POOR')      return '#DC2626';
    return '#1D9E75';
  };

  const getSoilLabel = function(health) {
    if (!health) return '';
    const h = health.toUpperCase();
    if (h === 'EXCELLENT') return T.excellent;
    if (h === 'GOOD')      return T.good;
    if (h === 'MODERATE')  return T.moderate;
    if (h === 'POOR')      return T.poor;
    return health;
  };

  const speakText = function(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'tamil' ? 'ta-IN' : 'en-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const metrics = [
    {
      icon: '🌍', label: T.ndvi,
      value: data ? data.ndvi || 0.45 : '--',
      sub: T.vegIndex, subColor: '#1D9E75', color: '#1D9E75',
    },
    {
      icon: '🌱', label: T.soil,
      value: data ? getSoilLabel(data.soilHealth) : '--',
      sub: lang === 'tamil' ? 'மண் ஆரோக்கியம்' : 'Soil Health',
      subColor: getColor(data && data.soilHealth),
      color:    getColor(data && data.soilHealth),
    },
    {
      icon: '🌿', label: T.cropStage,
      value: data ? data.cropStage || 'Active growth' : '--',
      sub: lang === 'tamil' ? 'பயிர் வளர்ச்சி' : 'Crop Growth',
      subColor: '#1D9E75', color: '#1D9E75',
    },
    {
      icon: '🌡️', label: T.temp,
      value: data ? Math.round(data.temperature || 32) + '°C' : '--',
      sub: lang === 'tamil' ? 'இன்றைய வெப்பம்' : 'Today Temperature',
      subColor: '#E24B4A', color: '#E24B4A',
    },
  ];

  const seasons = [
    { id: 'kharif', label: T.kharif },
    { id: 'rabi',   label: T.rabi   },
    { id: 'summer', label: T.summer  },
  ];

  if (loading) {
    return (
      <div style={{ minHeight:'80vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <div style={{ fontSize:56 }}>🛰️</div>
        <p style={{ fontSize:16, color:'#1D9E75', fontWeight:500 }}>{T.loading}</p>
      </div>
    );
  }

  const filteredCalendar = calendar.filter(function(m) {
    return m.season === activeSeason;
  });

  const tipsToShow = organicTips.length > 0 ? organicTips : defaultTips();

  return (
    <div style={{ minHeight:'100vh', background:'#F0FDF4', padding:'20px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div>
            <h2 style={{ fontSize:22, fontWeight:500, color:'#1D9E75', margin:'0 0 4px', display:'flex', alignItems:'center', gap:10 }}>
              🛰️ {T.title}
            </h2>
            <p style={{ fontSize:13, color:'#888', margin:0 }}>{T.subtitle}</p>
          </div>
          <button onClick={fetchData}
            style={{ background:'#1D9E75', color:'#fff', border:'none', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer' }}>
            {T.refresh}
          </button>
        </div>

        {/* Metric Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
          {metrics.map(function(m, i) {
            return (
              <div key={i} style={{ background:'#fff', borderRadius:16, padding:'20px 16px', border:'0.5px solid #e5e5e5', textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:10 }}>{m.icon}</div>
                <p style={{ fontSize:11, color:'#888', margin:'0 0 6px' }}>{m.label}</p>
                <p style={{ fontSize:20, fontWeight:500, color:m.color, margin:'0 0 4px' }}>{m.value}</p>
                <p style={{ fontSize:11, color:m.subColor, margin:0 }}>{m.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[
            { id:'calendar', label: T.calTab },
            { id:'organic',  label: T.orgTab  },
          ].map(function(tab) {
            return (
              <button key={tab.id}
                onClick={function() { setActiveTab(tab.id); }}
                style={{
                  padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:500, cursor:'pointer',
                  background: activeTab===tab.id ? '#1D9E75' : '#fff',
                  color:      activeTab===tab.id ? '#fff'    : '#555',
                  border:     activeTab===tab.id ? 'none'    : '0.5px solid #e5e5e5',
                }}>
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Crop Calendar Tab ── */}
        {activeTab === 'calendar' && (
          <>
            {/* Next sowing alert */}
            <div style={{ background:'#E1F5EE', borderRadius:14, padding:'14px 20px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:14, fontWeight:500, color:'#0F6E56', margin:'0 0 4px' }}>{T.nextSow}</p>
                <p style={{ fontSize:12, color:'#1D9E75', margin:0 }}>{T.nextSowSub}</p>
              </div>
              <button onClick={function() { speakText(T.nextSowSub); }}
                style={{ background:'#1D9E75', color:'#fff', border:'none', padding:'8px 14px', borderRadius:8, fontSize:12, cursor:'pointer', fontWeight:500 }}>
                {T.listen}
              </button>
            </div>

            {/* Season filter */}
            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
              {seasons.map(function(s) {
                return (
                  <button key={s.id}
                    onClick={function() { setActiveSeason(s.id); }}
                    style={{
                      padding:'8px 16px', borderRadius:20, fontSize:12, fontWeight:500, cursor:'pointer',
                      background: activeSeason===s.id ? '#1D9E75' : '#fff',
                      color:      activeSeason===s.id ? '#fff'    : '#555',
                      border:     activeSeason===s.id ? 'none'    : '0.5px solid #ddd',
                    }}>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Calendar grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
              {(filteredCalendar.length > 0
                ? filteredCalendar
                : defaultCalendar().filter(function(m) { return m.season === activeSeason; })
              ).map(function(month, i) {
                return (
                  <div key={i} style={{ background:'#fff', borderRadius:14, padding:20, border:'0.5px solid #e5e5e5' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontSize:24 }}>{month.icon || '🌾'}</span>
                        <h3 style={{ fontSize:15, fontWeight:500, color:'#222', margin:0 }}>
                          {lang === 'tamil' ? (month.monthTamil || month.month) : month.month}
                        </h3>
                      </div>
                      <span style={{ fontSize:18 }}>{month.weatherIcon || '🌤️'}</span>
                    </div>
                    <div style={{ background:'#F0FDF4', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                      <p style={{ fontSize:12, color:'#1D9E75', fontWeight:500, margin:'0 0 2px' }}>
                        {lang === 'tamil' ? '🌱 பயிர்கள்' : '🌱 Crops'}
                      </p>
                      <p style={{ fontSize:12, color:'#333', margin:0 }}>
                        {lang === 'tamil' ? (month.cropsTamil || month.crops) : month.crops}
                      </p>
                    </div>
                    <div style={{ background:'#FEF3C7', borderRadius:8, padding:'8px 12px', marginBottom:8 }}>
                      <p style={{ fontSize:12, color:'#B45309', fontWeight:500, margin:'0 0 2px' }}>
                        {lang === 'tamil' ? '📋 செயல்' : '📋 Action'}
                      </p>
                      <p style={{ fontSize:12, color:'#333', margin:0 }}>
                        {lang === 'tamil' ? (month.actionTamil || month.action) : month.action}
                      </p>
                    </div>
                    <div style={{ background:'#EFF6FF', borderRadius:8, padding:'8px 12px' }}>
                      <p style={{ fontSize:12, color:'#1D4ED8', fontWeight:500, margin:'0 0 2px' }}>
                        {lang === 'tamil' ? '💡 குறிப்பு' : '💡 Tip'}
                      </p>
                      <p style={{ fontSize:12, color:'#333', margin:0 }}>
                        {month.tip || ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Organic Tips Tab ── */}
        {activeTab === 'organic' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {tipsToShow.map(function(tip, i) {
              return (
                <div key={i} style={{ background:'#fff', borderRadius:14, padding:20, border:'0.5px solid #e5e5e5' }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>{tip.icon || '🌿'}</div>
                  <h3 style={{ fontSize:14, fontWeight:500, color:'#1D9E75', margin:'0 0 8px' }}>
                    {lang === 'tamil' ? tip.nameTamil : tip.name}
                  </h3>
                  <p style={{ fontSize:12, color:'#555', lineHeight:1.6, margin:'0 0 10px' }}>
                    {lang === 'tamil' ? tip.descTamil : tip.desc}
                  </p>
                  {tip.benefit && (
                    <div style={{ background:'#F0FDF4', borderRadius:8, padding:'8px 10px' }}>
                      <p style={{ fontSize:11, color:'#1D9E75', margin:0, fontWeight:500 }}>
                        {lang === 'tamil' ? (tip.benefitTamil || tip.benefit) : tip.benefit}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Default Calendar (fallback) ────────────────────
function defaultCalendar() {
  return [
    { month:'June',      monthTamil:'ஜூன்',      icon:'🌧️', weatherIcon:'🌧️', season:'kharif',
      crops:'Rice, Maize',         cropsTamil:'நெல், மக்காச்சோளம்',
      action:'Sow seeds',          actionTamil:'விதை விதைக்கவும்',
      tip:'Use organic compost' },
    { month:'July',      monthTamil:'ஜூலை',      icon:'💧', weatherIcon:'🌧️', season:'kharif',
      crops:'Rice, Groundnut',     cropsTamil:'நெல், நிலக்கடலை',
      action:'Weed control',       actionTamil:'களை நீக்கவும்',
      tip:'Ensure proper drainage' },
    { month:'August',    monthTamil:'ஆகஸ்ட்',    icon:'🌿', weatherIcon:'⛅', season:'kharif',
      crops:'Rice, Sesame',        cropsTamil:'நெல், எள்',
      action:'Apply fertilizer',   actionTamil:'உரம் இடுங்கள்',
      tip:'Monitor for pests' },
    { month:'September', monthTamil:'செப்டம்பர்', icon:'🌾', weatherIcon:'☀️', season:'kharif',
      crops:'Rice, Cotton',        cropsTamil:'நெல், பருத்தி',
      action:'Spray pesticides',   actionTamil:'பூச்சிக்கொல்லி தெளிக்கவும்',
      tip:'Check soil moisture' },
    { month:'October',   monthTamil:'அக்டோபர்',  icon:'🌦️', weatherIcon:'🌦️', season:'kharif',
      crops:'Rice, Pulses',        cropsTamil:'நெல், பயறு',
      action:'Harvest rice',       actionTamil:'நெல் அறுவடை செய்யுங்கள்',
      tip:'Store properly' },
    { month:'November',  monthTamil:'நவம்பர்',   icon:'🚜', weatherIcon:'☁️', season:'kharif',
      crops:'Rice, Groundnut',     cropsTamil:'நெல், நிலக்கடலை',
      action:'Harvest time',       actionTamil:'அறுவடை செய்யுங்கள்',
      tip:'Apply bio-fertilizer after harvest' },
    { month:'December',  monthTamil:'டிசம்பர்',  icon:'❄️', weatherIcon:'🌨️', season:'rabi',
      crops:'Wheat, Mustard',      cropsTamil:'கோதுமை, கடுகு',
      action:'Sow rabi crops',     actionTamil:'ரபி பயிர் விதைக்கவும்',
      tip:'Irrigate carefully' },
    { month:'January',   monthTamil:'ஜனவரி',    icon:'🌨️', weatherIcon:'❄️', season:'rabi',
      crops:'Wheat, Gram',         cropsTamil:'கோதுமை, கடலை',
      action:'Water management',   actionTamil:'நீர் மேலாண்மை செய்யுங்கள்',
      tip:'Morning irrigation is best' },
    { month:'February',  monthTamil:'பிப்ரவரி', icon:'🌸', weatherIcon:'🌤️', season:'rabi',
      crops:'Sunflower, Wheat',    cropsTamil:'சூரியகாந்தி, கோதுமை',
      action:'Monitor crop growth',actionTamil:'பயிர் வளர்ச்சி கண்காணிக்கவும்',
      tip:'Spray Jeevamrutham' },
    { month:'March',     monthTamil:'மார்ச்',    icon:'🌾', weatherIcon:'☀️', season:'rabi',
      crops:'Wheat, Groundnut',    cropsTamil:'கோதுமை, கடலை',
      action:'Harvest rabi crops', actionTamil:'ரபி அறுவடை செய்யுங்கள்',
      tip:'Test soil after harvest' },
    { month:'April',     monthTamil:'ஏப்ரல்',   icon:'☀️', weatherIcon:'🌡️', season:'summer',
      crops:'Green Gram, Sesame',  cropsTamil:'பச்சை பயிறு, எள்',
      action:'Summer crop or soil rest', actionTamil:'கோடை பயிர் அல்லது மண் ஓய்வு',
      tip:'Apply compost during rest' },
    { month:'May',       monthTamil:'மே',         icon:'🌱', weatherIcon:'🌡️', season:'summer',
      crops:'Soil Preparation',    cropsTamil:'மண் தயாரிப்பு',
      action:'Prepare for Kharif', actionTamil:'கரீஃப் தயாரிப்பு தொடங்குங்கள்',
      tip:'Soil test + bio-fertilizer prep' },
  ];
}

// ── Default Organic Tips (fallback) ───────────────
function defaultTips() {
  return [
    { icon:'🐄', name:'Vermicompost',    nameTamil:'🐄 மண்புழு உரம்',
      desc:'Apply 100 kg/hectare. Increases soil fertility by 40%.',
      descTamil:'100 கிலோ/ஹெக்டேர் மண்புழு உரம் இடுங்கள். மண் வளம் 40% அதிகரிக்கும்.',
      benefit:'✅ Increases yield by 40%', benefitTamil:'✅ மகசூல் 40% அதிகரிக்கும்' },
    { icon:'🌿', name:'Panchagavya',     nameTamil:'🌿 பஞ்சகவ்யா',
      desc:'Spray 3% solution. Accelerates crop growth naturally.',
      descTamil:'3% கரைசல் தெளிக்கவும். பயிர் வளர்ச்சி துரிதமாகும்.',
      benefit:'✅ Natural growth booster', benefitTamil:'✅ இயற்கையான வளர்ச்சி' },
    { icon:'🍃', name:'Jeevamrutham',    nameTamil:'🍃 ஜீவாமிர்தம்',
      desc:'Mix 200L/acre in irrigation water. Boosts soil microbes.',
      descTamil:'200 லிட்டர்/ஏக்கர் நீர்ப்பாசனத்தில் கலக்கவும்.',
      benefit:'✅ Boosts soil microbes', benefitTamil:'✅ மண் நுண்ணுயிர் அதிகரிக்கும்' },
    { icon:'🌱', name:'Green Manure',    nameTamil:'🌱 பசுந்தாள் உரம்',
      desc:'Plow under Sunnhemp at 45 days for nitrogen fixation.',
      descTamil:'தக்கைப்பூண்டு 45 நாளில் உழுது மடக்குங்கள்.',
      benefit:'✅ Adds nitrogen naturally', benefitTamil:'✅ இயற்கையாக நைட்ரஜன் சேர்க்கும்' },
    { icon:'🌾', name:'Neem Cake',       nameTamil:'🌾 வேப்பம் பிண்ணாக்கு',
      desc:'Apply 250 kg/hectare. Naturally reduces pest attacks.',
      descTamil:'250 கிலோ/ஹெக்டேர் இடுங்கள். பூச்சி தாக்குதல் குறையும்.',
      benefit:'✅ Natural pest control', benefitTamil:'✅ இயற்கை பூச்சி கட்டுப்பாடு' },
    { icon:'💧', name:'Drip Irrigation', nameTamil:'💧 சொட்டு நீர்ப்பாசனம்',
      desc:'Save 40% water. 90% government subsidy available.',
      descTamil:'40% நீர் மிச்சம். 90% மானியம் அரசு தருகிறது.',
      benefit:'✅ Save 40% water', benefitTamil:'✅ 40% நீர் சேமிக்கும்' },
    { icon:'🐛', name:'Bio Pest Control',nameTamil:'🐛 இயற்கை பூச்சி விரட்டி',
      desc:'Spray 3% neem oil + soap water. No chemicals needed.',
      descTamil:'வேப்ப எண்ணெய் 3% + சோப்பு நீர் கலந்து தெளிக்கவும்.',
      benefit:'✅ Chemical-free farming', benefitTamil:'✅ நஞ்சு இல்லாத விவசாயம்' },
    { icon:'🌍', name:'Soil Testing',    nameTamil:'🌍 மண் பரிசோதனை',
      desc:'Test soil every 6 months at government lab. Free service.',
      descTamil:'6 மாதத்திற்கு ஒரு முறை மண் பரிசோதனை செய்யுங்கள். இலவசம்.',
      benefit:'✅ Free government service', benefitTamil:'✅ அரசு இலவச சேவை' },
  ];
}