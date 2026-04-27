import { useLang } from '../context/LanguageContext';

export default function AboutUs() {
  const { lang } = useLang();

  const content = {
    title: lang === 'tamil'
      ? 'எங்களை பற்றி'
      : 'About Us',
    subtitle: lang === 'tamil'
      ? 'தமிழ்நாடு விவசாயிகளுக்காக உருவாக்கப்பட்ட AI பயன்பாடு'
      : 'AI-powered app built for Tamil Nadu farmers',
    mission: lang === 'tamil'
      ? 'எங்கள் நோக்கம்'
      : 'Our Mission',
    missionText: lang === 'tamil'
      ? 'தமிழ்நாட்டின் விவசாயிகளுக்கு நவீன தொழில்நுட்பத்தை எளிமையாக வழங்குவதே எங்கள் நோக்கம். AI மூலம் சரியான பயிரை தேர்வு செய்து, நோயை முன்கூட்டியே கண்டறிந்து, சந்தை விலையை அறிந்து சிறந்த வருமானம் பெற உதவுகிறோம்.'
      : 'Our mission is to bring modern technology to Tamil Nadu farmers in a simple way. We help them choose the right crop using AI, detect diseases early, know market prices and earn better income.',
    features: lang === 'tamil'
      ? 'எங்கள் சேவைகள்'
      : 'Our Services',
    developer: lang === 'tamil'
      ? 'உருவாக்கியவர்'
      : 'Developer',
  };

  const features = [
    { icon: '🌱', title: lang === 'tamil' ? 'பயிர் பரிந்துரை' : 'Crop Recommendation',
      desc: lang === 'tamil' ? 'மண் மற்றும் வானிலை தரவை பயன்படுத்தி சிறந்த பயிரை AI பரிந்துரைக்கும்' : 'AI recommends the best crop using soil and weather data' },
    { icon: '🔬', title: lang === 'tamil' ? 'நோய் கண்டறிதல்' : 'Disease Detection',
      desc: lang === 'tamil' ? 'படம் பதிவேற்றினால் உடனே நோயை கண்டறிந்து சிகிச்சை சொல்லும்' : 'Upload a photo and instantly detect disease with treatment' },
    { icon: '🛰️', title: lang === 'tamil' ? 'செயற்கைக்கோள் பண்ணை' : 'Satellite Farm Analysis',
      desc: lang === 'tamil' ? 'NASA செயற்கைக்கோள் மூலம் மண் ஆரோக்கியம் தானாகவே பெறப்படும்' : 'Soil health fetched automatically via NASA satellite' },
    { icon: '📈', title: lang === 'tamil' ? 'சந்தை விலை' : 'Market Prices',
      desc: lang === 'tamil' ? 'தினமும் புதுப்பிக்கப்படும் தமிழ்நாடு மண்டி விலைகள்' : 'Daily updated Tamil Nadu mandi prices' },
    { icon: '🏛️', title: lang === 'tamil' ? 'அரசு மானியங்கள்' : 'Government Subsidies',
      desc: lang === 'tamil' ? 'PM கிசான் உள்பட அனைத்து திட்டங்களும் ஒரே இடத்தில்' : 'All schemes including PM Kisan in one place' },
   
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0FDF4',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #1D9E75, #0F6E56)',
          borderRadius: 20, padding: '40px 36px',
          textAlign: 'center', marginBottom: 32, color: '#fff',
        }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌾</div>
          <h1 style={{
            fontSize: 28, fontWeight: 500,
            margin: '0 0 12px', color: '#fff',
          }}>
            {content.title}
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>
            {content.subtitle}
          </p>
        </div>

        {/* Mission */}
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: 28, marginBottom: 24,
          border: '0.5px solid #e5e5e5',
        }}>
          <h2 style={{
            fontSize: 18, fontWeight: 500,
            color: '#1D9E75', margin: '0 0 14px',
          }}>
            🎯 {content.mission}
          </h2>
          <p style={{
            fontSize: 15, color: '#444',
            lineHeight: 1.9, margin: 0,
          }}>
            {content.missionText}
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontSize: 18, fontWeight: 500,
            color: '#222', margin: '0 0 16px',
          }}>
            🌿 {content.features}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 14,
          }}>
            {features.map(function(f, i) {
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14,
                  padding: 20, border: '0.5px solid #e5e5e5',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>
                    {f.icon}
                  </div>
                  <h3 style={{
                    fontSize: 14, fontWeight: 500,
                    color: '#1D9E75', margin: '0 0 6px',
                  }}>
                    {f.title}
                  </h3>
                  <p style={{
                    fontSize: 12, color: '#666',
                    lineHeight: 1.6, margin: 0,
                  }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer Card */}
        <div style={{
          background: '#fff', borderRadius: 16,
          padding: 28, border: '0.5px solid #e5e5e5',
        }}>
          <h2 style={{
            fontSize: 18, fontWeight: 500,
            color: '#222', margin: '0 0 20px',
          }}>
            👩‍💻 {content.developer}
          </h2>
          <div style={{
            display: 'flex', gap: 20, alignItems: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#E1F5EE',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32, flexShrink: 0,
            }}>
              👩‍🌾
            </div>
            <div>
              <h3 style={{
                fontSize: 18, fontWeight: 500,
                color: '#222', margin: '0 0 4px',
              }}>
                Abinaya Shri P
              </h3>
              <p style={{
                fontSize: 13, color: '#1D9E75',
                margin: '0 0 10px',
              }}>
                {lang === 'tamil'
                  ? 'MCA பட்டதாரி — Java Developer'
                  : 'MCA Graduate — Java Developer'}
              </p>
              <div style={{
                display: 'flex', gap: 10, flexWrap: 'wrap',
              }}>
                {[
                  { icon: '📧', text: 'abinayashri0506@gmail.com' },
                  { icon: '💼', text: 'linkedin.com/in/abinayashri-p' },
                  { icon: '💻', text: 'github.com/ABINAYASHRI05' },
                ].map(function(item, i) {
                  return (
                    <span key={i} style={{
                      fontSize: 12, color: '#555',
                      background: '#F0FDF4',
                      padding: '4px 12px',
                      borderRadius: 20,
                      border: '0.5px solid #9FE1CB',
                    }}>
                      {item.icon} {item.text}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}