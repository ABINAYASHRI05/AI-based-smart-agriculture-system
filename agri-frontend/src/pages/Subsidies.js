import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

const CATEGORIES = ['ALL','SEED','FERTILIZER','LOAN','INSURANCE','INCOME'];
const COLORS = {
  SEED:'#EAF3DE', LOAN:'#EFF6FF',
  INSURANCE:'#EEEDFE', INCOME:'#E1F5EE', FERTILIZER:'#FAEEDA'
};

export default function Subsidies() {
  const [subsidies, setSubsidies] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const { lang } = useLang();
  const isTamil = lang === 'tamil';

  useEffect(() => {
    API.get('/subsidies?state=Tamil Nadu').then(r => setSubsidies(r.data));
  }, []);

  const filtered = filter === 'ALL'
    ? subsidies
    : subsidies.filter(s => s.category === filter);

  const CATEGORY_LABELS = {
    ALL:        isTamil ? 'அனைத்தும்' : 'ALL',
    SEED:       isTamil ? 'விதை'       : 'SEED',
    FERTILIZER: isTamil ? 'உரம்'       : 'FERTILIZER',
    LOAN:       isTamil ? 'கடன்'       : 'LOAN',
    INSURANCE:  isTamil ? 'காப்பீடு'  : 'INSURANCE',
    INCOME:     isTamil ? 'வருமானம்'  : 'INCOME',
  };

  return (
    <div style={{ padding:24, maxWidth:800, margin:'0 auto' }}>
      <h2>{isTamil ? '🏛️ அரசு மானியங்கள்' : '🏛️ Government Subsidies'}</h2>
      <p>{isTamil
        ? 'தமிழ்நாடு — அனைத்து திட்டங்களும் 2026'
        : 'Tamil Nadu — All Government Schemes 2026'}
      </p>

      {/* Category Filter */}
      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{ padding:'6px 14px', borderRadius:20, border:'none',
              background: filter===c ? '#1D9E75' : '#f0f0f0',
              color: filter===c ? '#fff' : '#555',
              cursor:'pointer', fontSize:12, fontWeight:500 }}>
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Subsidy Cards */}
      <div style={{ display:'grid', gap:14 }}>
        {filtered.length === 0 ? (
          <p style={{ color:'#999', textAlign:'center', marginTop:40 }}>
            {isTamil ? 'தரவு இல்லை' : 'No data available'}
          </p>
        ) : filtered.map(s => (
          <div key={s.id} style={{ background:'#fff', borderRadius:12,
            border:'0.5px solid #e5e5e5', padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between',
              alignItems:'flex-start' }}>
              <div>
                <h3 style={{ fontSize:15, fontWeight:500, margin:'0 0 4px' }}>
                  {isTamil ? s.schemeNameTamil : s.schemeName}
                </h3>
                <p style={{ fontSize:13, color:'#555', margin:'0 0 4px' }}>
                  {isTamil ? s.descriptionTamil : s.description}
                </p>
              </div>
              <span style={{ background: COLORS[s.category] || '#f0f0f0',
                padding:'4px 12px', borderRadius:20, fontSize:11,
                fontWeight:500, whiteSpace:'nowrap',
                marginLeft:12, color:'#333' }}>
                {CATEGORY_LABELS[s.category] || s.category}
              </span>
            </div>

            <div style={{ display:'flex', gap:16, marginTop:12,
              flexWrap:'wrap', fontSize:12, color:'#555' }}>
              <span>💰 {s.amount}</span>
              <span>✅ {s.eligibility}</span>
              <span>📅 {isTamil ? 'கடைசி தேதி' : 'Deadline'}: {s.deadline}</span>
            </div>

            <a href={s.applyUrl} target="_blank" rel="noreferrer"
              style={{ display:'inline-block', marginTop:12,
                padding:'7px 18px', background:'#1D4ED8', color:'#fff',
                borderRadius:8, fontSize:12, textDecoration:'none',
                fontWeight:500 }}>
              {isTamil ? 'விண்ணப்பிக்க ↗' : 'Apply Now ↗'}
            </a>
          </div>
        ))}
      </div>

      <p style={{ fontSize:11, color:'#999', marginTop:16 }}>
        {isTamil
          ? '* திட்டங்கள் 2026 தமிழ்நாடு அரசு அறிவிப்பின்படி புதுப்பிக்கப்பட்டது'
          : '* Schemes updated as per Tamil Nadu Government announcements 2026'}
      </p>
    </div>
  );
}