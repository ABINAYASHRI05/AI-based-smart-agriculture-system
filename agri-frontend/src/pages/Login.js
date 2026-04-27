import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

export default function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('agri_token',    res.data.token);
      localStorage.setItem('agri_name',     res.data.name);
      localStorage.setItem('agri_email',    res.data.email);
      localStorage.setItem('agri_location', res.data.location || 'Chennai');
      navigate('/');
    } catch {
      setError('தவறான email அல்லது password. / Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 36,
        width: 380,
        border: '0.5px solid #e5e5e5',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>🌾</div>
          <h2 style={{ color: '#1D9E75', marginTop: 8 }}>
            விவசாய உதவியாளர்
          </h2>
          <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
            Smart Agriculture System
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#FCEBEB', color: '#991B1B',
            padding: '10px 14px', borderRadius: 8,
            fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, color: '#555',
              display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="yourname@gmail.com"
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: '#555',
              display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: 8, border: '1px solid #ddd',
                fontSize: 13,
              }}
            />
          </div>
          {/* Forgot password link */}
<div style={{
  textAlign:'right', margin:'-8px 0 16px',
}}>
  <Link to="/forgot-password" style={{
    fontSize:12, color:'#1D9E75',
    textDecoration:'none', fontWeight:500,
  }}>
    {lang==='tamil'
      ? '🔐 கடவுச்சொல் மறந்துவிட்டதா?'
      : '🔐 Forgot Password?'}
  </Link>
</div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 13,
              background: loading ? '#9CA3AF' : '#1D9E75',
              color: '#fff', border: 'none',
              borderRadius: 8, fontSize: 14,
              fontWeight: 500,
            }}
          >
            {loading ? '⏳ உள்நுழைகிறது...' : 'உள்நுழைய / Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13,
          color: '#666' }}>
          புதிய கணக்கு?{' '}
          <Link to="/register" style={{ color: '#1D9E75', fontWeight: 500 }}>
            பதிவு செய்யுங்கள் / Register
          </Link>
        </p>
      </div>
    </div>
  );
}