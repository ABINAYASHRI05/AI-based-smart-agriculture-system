import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

export default function Register() {
  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    phone:    '',
    location: 'Chennai',
    soilType: 'Clay Loam',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate  = useNavigate();
  const { lang, switchLang } = useLang();

  const T = {
    title:    lang==='tamil' ? 'புதிய பதிவு'              : 'Create Account',
    sub:      lang==='tamil' ? 'இலவசமாக பதிவு செய்யுங்கள்' : 'Register for free',
    name:     lang==='tamil' ? 'பெயர்'                    : 'Full Name',
    email:    lang==='tamil' ? 'மின்னஞ்சல்'               : 'Email',
    password: lang==='tamil' ? 'கடவுச்சொல்'               : 'Password',
    phone:    lang==='tamil' ? 'கைபேசி எண்'               : 'Phone Number',
    location: lang==='tamil' ? 'இடம்'                     : 'Location',
    soil:     lang==='tamil' ? 'மண் வகை'                  : 'Soil Type',
    btn:      lang==='tamil' ? 'பதிவு செய்யுங்கள்'        : 'Register',
    loading:  lang==='tamil' ? 'பதிவு செய்கிறது...'       : 'Registering...',
    have:     lang==='tamil' ? 'கணக்கு உள்ளதா?'           : 'Already have account?',
    login:    lang==='tamil' ? 'உள்நுழைய'                 : 'Login',
  };

  const locations = [
    'Chennai','Coimbatore','Madurai','Salem',
    'Trichy','Tirunelveli','Erode','Vellore',
    'Thanjavur','Tiruppur','Dindigul','Karur',
    'Kanyakumari','Thoothukudi','Namakkal',
  ];

  const soils = [
    'Clay Loam','Sandy','Loamy',
    'Red Soil','Black Soil','Alluvial',
  ];

  const handleChange = function(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async function(e) {
    e.preventDefault();
    setError('');

    // Validate
    if (!form.name.trim()) {
      setError(lang==='tamil'
        ? 'பெயர் கொடுங்கள்'
        : 'Please enter your name');
      return;
    }
    if (!form.email.trim()
        || !form.email.includes('@')) {
      setError(lang==='tamil'
        ? 'சரியான மின்னஞ்சல் கொடுங்கள்'
        : 'Please enter valid email');
      return;
    }
    if (form.password.length < 6) {
      setError(lang==='tamil'
        ? 'கடவுச்சொல் குறைந்தது 6 எழுத்து'
        : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        name:     form.name.trim(),
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        phone:    form.phone.trim(),
        location: form.location,
        soilType: form.soilType,
      };

      console.log('Sending register request:',
        requestData);

      const res = await API.post(
        '/auth/register', requestData);

      console.log('Register response:', res.data);
      setSuccess(true);

    } catch (err) {
      console.error('Register error:', err);
      const msg =
        err.response?.data?.error
        || err.response?.data?.message
        || (err.response?.status === 400
          ? (lang==='tamil'
            ? 'மின்னஞ்சல் ஏற்கனவே உள்ளது'
            : 'Email already exists')
          : err.response?.status === 500
          ? (lang==='tamil'
            ? 'சர்வர் பிழை. Spring Boot இயங்குகிறதா?'
            : 'Server error. Is Spring Boot running?')
          : (lang==='tamil'
            ? 'பிழை. இணைப்பை சரிபாருங்கள்.'
            : 'Error. Check your connection.'));
      setError(msg);
    }
    setLoading(false);
  };

  // ── SUCCESS PAGE ─────────────────────────────────
  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '48px 36px',
          width: 400,
          textAlign: 'center',
          border: '0.5px solid #e5e5e5',
        }}>
          <div style={{ fontSize: 72 }}>🎉</div>
          <h2 style={{
            color: '#1D9E75',
            margin: '12px 0 8px',
          }}>
            {lang==='tamil'
              ? 'பதிவு வெற்றி!'
              : 'Registration Successful!'}
          </h2>
          <p style={{
            color: '#555', fontSize: 14,
            margin: '0 0 12px', lineHeight: 1.7,
          }}>
            {lang==='tamil'
              ? 'உங்கள் கணக்கு உருவாக்கப்பட்டது!'
              : 'Your account has been created!'}
          </p>
          <div style={{
            background: '#E1F5EE',
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}>
            <p style={{
              color: '#0F6E56',
              fontSize: 13,
              margin: 0,
              lineHeight: 1.8,
            }}>
              ✅ {lang==='tamil'
                ? 'கணக்கு உருவாக்கப்பட்டது'
                : 'Account created'}<br />
              📧 {lang==='tamil'
                ? 'வரவேற்பு மின்னஞ்சல் அனுப்பப்பட்டது'
                : 'Welcome email sent to inbox'}<br />
              🌾 {lang==='tamil'
                ? 'இப்போது உள்நுழையுங்கள்'
                : 'You can login now'}
            </p>
          </div>
          <button
            onClick={function() {
              navigate('/login');
            }}
            style={{
              width: '100%',
              padding: 14,
              background: '#1D9E75',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {lang==='tamil'
              ? '→ உள்நுழைய செல்லுங்கள்'
              : '→ Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  // ── REGISTER FORM ────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      padding: '20px 16px',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 420,
        border: '0.5px solid #e5e5e5',
      }}>

        {/* Language toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 12,
        }}>
          {['tamil','english'].map(function(l) {
            return (
              <button key={l}
                onClick={function() {
                  switchLang(l);
                }}
                style={{
                  padding: '4px 12px',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginLeft: 4,
                  background: lang===l
                    ? '#1D9E75' : '#f0f0f0',
                  color: lang===l
                    ? '#fff' : '#555',
                }}
              >
                {l==='tamil' ? 'தமிழ்' : 'EN'}
              </button>
            );
          })}
        </div>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: 40 }}>🧑‍🌾</div>
          <h2 style={{
            color: '#1D9E75',
            margin: '8px 0 4px',
            fontSize: 20,
          }}>
            {T.title}
          </h2>
          <p style={{
            color: '#888',
            fontSize: 12,
            margin: 0,
          }}>
            {T.sub}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            background: '#FCEBEB',
            color: '#991B1B',
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 14,
            borderLeft: '3px solid #E24B4A',
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>{T.name} *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={lang==='tamil'
                ? 'உங்கள் முழு பெயர்'
                : 'Your full name'}
              required
              style={inp}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>{T.email} *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
              style={inp}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>
              {T.password} *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={lang==='tamil'
                ? 'குறைந்தது 6 எழுத்து'
                : 'Minimum 6 characters'}
              required
              style={inp}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>{T.phone}</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
              maxLength={10}
              style={inp}
            />
          </div>

          {/* Location + Soil side by side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
            marginBottom: 20,
          }}>
            <div>
              <label style={lbl}>{T.location}</label>
              <select
                name="location"
                value={form.location}
                onChange={handleChange}
                style={sel}
              >
                {locations.map(function(loc) {
                  return (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label style={lbl}>{T.soil}</label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                style={sel}
              >
                {soils.map(function(s) {
                  return (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 14,
              background: loading
                ? '#9CA3AF' : '#1D9E75',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 500,
              cursor: loading
                ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? T.loading : T.btn}
          </button>
        </form>

        {/* Login link */}
        <p style={{
          textAlign: 'center',
          marginTop: 16,
          fontSize: 13,
          color: '#666',
        }}>
          {T.have}{' '}
          <Link to="/login" style={{
            color: '#1D9E75',
            fontWeight: 500,
            textDecoration: 'none',
          }}>
            {T.login}
          </Link>
        </p>

      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────
const inp = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1.5px solid #ddd',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#FAFAFA',
  color: '#222',
  fontFamily: 'Arial',
};

const sel = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1.5px solid #ddd',
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#FAFAFA',
  color: '#222',
  fontFamily: 'Arial',
};

const lbl = {
  fontSize: 12,
  color: '#555',
  display: 'block',
  marginBottom: 5,
  fontWeight: 500,
};