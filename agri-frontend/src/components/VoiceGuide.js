import { useState, useEffect, useRef } from 'react';

const GUIDE_STEPS = [
  {
    id: 1,
    icon: '🌾',
    titleTamil: 'வணக்கம்! விவசாய உதவியாளருக்கு வரவேற்கிறோம்!',
    titleEnglish: 'Welcome to Smart Agriculture Assistant!',
    speechTamil: 'வணக்கம் விவசாயி நண்பரே! இது உங்களுக்கான விவசாய உதவி பயன்பாடு. இந்த பயன்பாடு உங்கள் பயிருக்கு என்ன நல்லது என்று சொல்லும். நோய் கண்டறியும். அரசு மானியம் பெற உதவும். சந்தை விலை காட்டும்.',
    speechEnglish: 'Welcome farmer friend! This app will help you with crop recommendations, disease detection, government subsidies and market prices.',
  },
  {
    id: 2,
    icon: '🌱',
    titleTamil: 'பயிர் பரிந்துரை',
    titleEnglish: 'Crop Recommendation',
    speechTamil: 'முதல் பொத்தான் பயிர் பரிந்துரை. இதை தொட்டால் உங்கள் மண்ணுக்கும் வானிலைக்கும் ஏற்ற பயிரை AI சொல்லும். நீங்கள் எதுவும் தட்டச்சு செய்ய வேண்டாம். தானாகவே உங்கள் இடத்தின் தரவை எடுக்கும்.',
    speechEnglish: 'First button is Crop Recommendation. Tap it and AI will tell you the best crop for your soil and weather. No typing needed — it auto-detects your location.',
  },
  {
    id: 3,
    icon: '🔬',
    titleTamil: 'நோய் கண்டறிதல்',
    titleEnglish: 'Disease Detection',
    speechTamil: 'இரண்டாவது பொத்தான் நோய் கண்டறிதல். உங்கள் பயிரின் படம் எடுத்து பதிவேற்றுங்கள். AI உடனே நோயை கண்டறிந்து மருந்து சொல்லும். மிகவும் எளிமையானது.',
    speechEnglish: 'Second button is Disease Detection. Take a photo of your crop and upload it. AI will immediately identify the disease and suggest medicine.',
  },
  {
    id: 4,
    icon: '📈',
    titleTamil: 'சந்தை விலை',
    titleEnglish: 'Market Prices',
    speechTamil: 'மூன்றாவது சந்தை விலை. இன்றைய நெல், தக்காளி, வெங்காயம் விலை இங்கே தெரியும். எந்த சந்தையில் விற்கலாம் என்று தெரியும்.',
    speechEnglish: 'Third is Market Prices. See today prices for rice, tomato, onion and more. Know which market to sell your crops.',
  },
  {
    id: 5,
    icon: '🏛️',
    titleTamil: 'அரசு மானியங்கள்',
    titleEnglish: 'Government Subsidies',
    speechTamil: 'நான்காவது அரசு மானியங்கள். PM கிசான், விதை மானியம், பயிர் காப்பீடு போன்ற திட்டங்கள் இங்கே தெரியும். விண்ணப்பிக்க நேரடி இணைப்பும் உள்ளது.',
    speechEnglish: 'Fourth is Government Subsidies. See schemes like PM Kisan, seed subsidy, crop insurance. Direct link to apply is also available.',
  },
  {
    id: 6,
    icon: '💬',
    titleTamil: 'AI உதவியாளர் — Chatbot',
    titleEnglish: 'AI Assistant Chatbot',
    speechTamil: 'திரையின் கீழ் வலது மூலையில் பச்சை நிற பேச்சு பொத்தான் உள்ளது. எந்த கேள்வியும் தமிழில் கேளுங்கள். உடனே பதில் கிடைக்கும். படமும் பதிவேற்றலாம். குரலிலும் கேட்கலாம்.',
    speechEnglish: 'Bottom right corner has a green chat button. Ask any question in Tamil. You will get an instant answer. You can also upload photos and use voice input.',
  },
  {
    id: 7,
    icon: '🛰️',
    titleTamil: 'செயற்கைக்கோள் பண்ணை பகுப்பாய்வு',
    titleEnglish: 'Satellite Farm Analysis',
    speechTamil: 'My Farm பக்கத்தில் செயற்கைக்கோள் மூலம் உங்கள் நிலத்தின் மண் ஆரோக்கியம் தெரியும். மாத வாரியான பயிர் நாட்காட்டி கிடைக்கும். இயற்கை விவசாய குறிப்புகளும் தெரியும்.',
    speechEnglish: 'My Farm page shows your soil health using satellite data. Get month by month crop calendar and organic farming tips.',
  },
  {
    id: 8,
    icon: '👤',
    titleTamil: 'பதிவு செய்வது எப்படி?',
    titleEnglish: 'How to Register?',
    speechTamil: 'மேலே உள்நுழைய பொத்தானை தொடுங்கள். உங்கள் பெயர், கைபேசி எண் கொடுங்கள். பதிவு செய்தால் உங்கள் பயிர் வரலாறு சேமிக்கப்படும். அலர்ட் வரும்.',
    speechEnglish: 'Tap the Login button at top. Enter your name and phone number. After registering your crop history will be saved and you will get alerts.',
  },
  {
    id: 9,
    icon: '✅',
    titleTamil: 'தொடங்கலாம்!',
    titleEnglish: 'Let us Get Started!',
    speechTamil: 'இப்போது தொடங்கலாம். கீழே உள்ள பொத்தான்களை தொட்டு பயன்படுத்துங்கள். ஏதாவது சந்தேகம் இருந்தால் கீழ் வலது மூலையில் உள்ள பேச்சு பொத்தானை தொட்டு கேளுங்கள். நன்றி!',
    speechEnglish: 'Now let us begin! Tap the buttons below to use the app. If you have any doubt tap the chat button at bottom right. Thank you!',
  },
];

export default function VoiceGuide() {
  const [show,      setShow]      = useState(false);
  const [step,      setStep]      = useState(0);
  const [speaking,  setSpeaking]  = useState(false);
  const [lang,      setLang]      = useState('tamil');
  const [autoSpeak, setAutoSpeak] = useState(true);

  const synthRef = useRef(window.speechSynthesis);
  const utterRef = useRef(null);

  // Show guide on first visit only
  useEffect(function() {
    const seen = localStorage.getItem('guide_seen');
    if (!seen) {
      setTimeout(function() { setShow(true); }, 1000);
    }
  }, []);

  // Auto speak when step or lang changes
  useEffect(function() {
    if (show && autoSpeak) {
      speak(GUIDE_STEPS[step]);
    }
    return function() { stopSpeaking(); };
  }, [step, show, lang]);

  const speak = function(stepData) {
    stopSpeaking();
    if (!('speechSynthesis' in window)) return;

    const text = lang === 'tamil'
      ? stepData.speechTamil
      : stepData.speechEnglish;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang   = lang === 'tamil' ? 'ta-IN' : 'en-IN';
    utter.rate   = 0.85;
    utter.pitch  = 1.0;
    utter.volume = 1.0;

    const voices = synthRef.current.getVoices();
    const preferred = voices.find(function(v) {
      return lang === 'tamil'
        ? v.lang.includes('ta') || v.name.includes('Tamil')
        : v.lang.includes('en-IN') || v.name.includes('India');
    });
    if (preferred) utter.voice = preferred;

    utter.onstart = function() { setSpeaking(true); };
    utter.onend   = function() { setSpeaking(false); };
    utter.onerror = function() { setSpeaking(false); };

    utterRef.current = utter;
    synthRef.current.speak(utter);
  };

  const stopSpeaking = function() {
    synthRef.current.cancel();
    setSpeaking(false);
  };

  const handleNext = function() {
    stopSpeaking();
    if (step < GUIDE_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = function() {
    stopSpeaking();
    if (step > 0) setStep(step - 1);
  };

  const handleFinish = function() {
    stopSpeaking();
    localStorage.setItem('guide_seen', 'true');
    setShow(false);
  };

  const handleReplay = function() {
    speak(GUIDE_STEPS[step]);
  };

  const handleSkip = function() {
    stopSpeaking();
    localStorage.setItem('guide_seen', 'true');
    setShow(false);
  };

  const currentStep = GUIDE_STEPS[step];
  const isLast      = step === GUIDE_STEPS.length - 1;

  // ── NO BUTTON SHOWN AFTER GUIDE CLOSES ──────────────
  if (!show) {
    return null;
  }

  // ── GUIDE MODAL ──────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.75)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          background: '#1D9E75',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{
            color: '#fff', fontSize: 13,
            fontWeight: 500, margin: 0,
          }}>
            🌾 பயன்பாடு வழிகாட்டி / App Guide
          </p>

          {/* Language toggle — green not blue */}
          <div style={{
            display: 'flex', gap: 4,
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 20, padding: 3,
          }}>
            {['tamil', 'english'].map(function(l) {
              return (
                <button key={l}
                  onClick={function() {
                    stopSpeaking();
                    setLang(l);
                  }}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 16,
                    border: 'none',
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: lang === l
                      ? '#fff' : 'transparent',
                    color: lang === l
                      ? '#1D9E75' : '#fff',
                  }}
                >
                  {l === 'tamil' ? 'தமிழ்' : 'EN'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 5, padding: '12px 0 0',
        }}>
          {GUIDE_STEPS.map(function(_, i) {
            return (
              <div key={i}
                onClick={function() {
                  stopSpeaking();
                  setStep(i);
                }}
                style={{
                  width:  i === step ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === step
                    ? '#1D9E75'
                    : i < step
                    ? '#9FE1CB'
                    : '#e0e0e0',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              />
            );
          })}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px' }}>

          {/* Icon */}
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: '#E1F5EE',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
          }}>
            {currentStep.icon}
          </div>

          {/* Title */}
          <h3 style={{
            textAlign: 'center',
            fontSize: 15, fontWeight: 500,
            color: '#1D9E75', margin: '0 0 10px',
          }}>
            {lang === 'tamil'
              ? currentStep.titleTamil
              : currentStep.titleEnglish}
          </h3>

          {/* Speech text */}
          <p style={{
            textAlign: 'center',
            fontSize: 13, color: '#555',
            lineHeight: 1.8, margin: '0 0 16px',
          }}>
            {lang === 'tamil'
              ? currentStep.speechTamil
              : currentStep.speechEnglish}
          </p>

          {/* Speaking indicator */}
          {speaking && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6, marginBottom: 14,
            }}>
              <div style={{
                display: 'flex', gap: 4,
                alignItems: 'center',
              }}>
                {[0, 1, 2, 3].map(function(i) {
                  return (
                    <div key={i} style={{
                      width: 4,
                      height: 4 + (i % 2 === 0 ? 8 : 4),
                      background: '#1D9E75',
                      borderRadius: 2,
                      animation: 'wave 0.8s infinite ' +
                        (i * 0.15) + 's',
                    }} />
                  );
                })}
              </div>
              <span style={{
                fontSize: 12,
                color: '#1D9E75',
                fontWeight: 500,
              }}>
                {lang === 'tamil'
                  ? 'பேசுகிறேன்...'
                  : 'Speaking...'}
              </span>
            </div>
          )}

          {/* Replay + Sound toggle */}
          <div style={{
            display: 'flex', gap: 8, marginBottom: 12,
          }}>
            <button onClick={handleReplay}
              style={{
                flex: 1, padding: 10,
                background: speaking
                  ? '#E1F5EE' : '#f5f5f5',
                border: 'none', borderRadius: 10,
                fontSize: 12, cursor: 'pointer',
                color: speaking ? '#1D9E75' : '#555',
                fontWeight: 500,
              }}
            >
              🔊 {lang === 'tamil'
                ? 'மீண்டும் கேளு'
                : 'Replay'}
            </button>

            <button
              onClick={function() {
                setAutoSpeak(!autoSpeak);
              }}
              style={{
                flex: 1, padding: 10,
                background: autoSpeak
                  ? '#E1F5EE' : '#f5f5f5',
                border: 'none', borderRadius: 10,
                fontSize: 12, cursor: 'pointer',
                color: autoSpeak ? '#1D9E75' : '#555',
                fontWeight: 500,
              }}
            >
              {autoSpeak ? '🔔' : '🔕'}
              {lang === 'tamil'
                ? (autoSpeak ? ' ஒலி ஆன்' : ' ஒலி ஆஃப்')
                : (autoSpeak ? ' Sound On' : ' Sound Off')}
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button onClick={handlePrev}
                style={{
                  flex: 1, padding: 12,
                  background: '#f5f5f5',
                  border: 'none', borderRadius: 12,
                  fontSize: 13, cursor: 'pointer',
                  color: '#555', fontWeight: 500,
                }}
              >
                ← {lang === 'tamil'
                  ? 'முந்தையது'
                  : 'Previous'}
              </button>
            )}

            <button onClick={handleNext}
              style={{
                flex: 2, padding: 12,
                background: '#1D9E75',
                border: 'none', borderRadius: 12,
                fontSize: 13, cursor: 'pointer',
                color: '#fff', fontWeight: 500,
              }}
            >
              {isLast
                ? (lang === 'tamil'
                  ? '✅ தொடங்கலாம்!'
                  : '✅ Let us Start!')
                : (lang === 'tamil'
                  ? 'அடுத்தது →'
                  : 'Next →')}
            </button>
          </div>

          {/* Skip */}
          <button onClick={handleSkip}
            style={{
              width: '100%', marginTop: 10,
              padding: 8, background: 'none',
              border: 'none', fontSize: 12,
              color: '#999', cursor: 'pointer',
            }}
          >
            {lang === 'tamil'
              ? 'தவிர்க்க / Skip Guide'
              : 'Skip Guide'}
          </button>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50%       { transform: scaleY(2); }
          }
        `}</style>
      </div>
    </div>
  );
}