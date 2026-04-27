import { useState } from 'react';
import { Link, useNavigate, useLocation }
  from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

const SERVICES = [
  { path: '/satellite', icon: '🛰️',
    tamil: 'என் பண்ணை',    english: 'My Farm'        },
  { path: '/crop',      icon: '🌱',
    tamil: 'பயிர் பரிந்துரை', english: 'Crop Advice'  },
  { path: '/disease',   icon: '🔬',
    tamil: 'நோய் கண்டறிதல்', english: 'Disease Check' },
  { path: '/market',    icon: '📈',
    tamil: 'சந்தை விலை',    english: 'Market Prices'  },
  { path: '/subsidies', icon: '🏛️',
    tamil: 'அரசு மானியம்',   english: 'Subsidies'     },
  
];

export default function Navbar() {
  const [dropOpen, setDropOpen] = useState(false);
  const navigate   = useNavigate();
  const location   = useLocation();
  const token      = localStorage.getItem('agri_token');
  const name       = localStorage.getItem('agri_name');
  const { lang, switchLang } = useLang();

  const logout = function() {
    localStorage.clear();
    navigate('/login');
  };

  const isServiceActive = SERVICES.some(
    function(s) { return s.path === location.pathname; }
  );

  return (
    <>
      <nav style={{
        background: '#1D9E75',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>

        {/* Brand */}
        <Link to="/" style={{
          color: '#fff', fontWeight: 500,
          fontSize: 15, textDecoration: 'none',
          whiteSpace: 'nowrap', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          🌾
          <span>
            {lang === 'tamil'
              ? 'விவசாய உதவியாளர்'
              : 'AgriAssist'}
          </span>
        </Link>

        {/* Center Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>

          {/* Home */}
          <Link to="/"
            style={{
              color: location.pathname === '/'
                ? '#fff' : 'rgba(255,255,255,0.85)',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 8,
              background: location.pathname === '/'
                ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: location.pathname === '/'
                ? 500 : 400,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            🏠 {lang === 'tamil' ? 'முகப்பு' : 'Home'}
          </Link>

          {/* Services Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={function() {
                setDropOpen(!dropOpen);
              }}
              style={{
                color: isServiceActive
                  ? '#fff' : 'rgba(255,255,255,0.85)',
                fontSize: 13,
                padding: '6px 14px',
                borderRadius: 8,
                background: isServiceActive
                  ? 'rgba(255,255,255,0.2)' : 'transparent',
                fontWeight: isServiceActive ? 500 : 400,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center', gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              🌿 {lang === 'tamil' ? 'சேவைகள்' : 'Services'}
              <span style={{
                fontSize: 10,
                transform: dropOpen
                  ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
                display: 'inline-block',
              }}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {dropOpen && (
              <div style={{
                position: 'absolute',
                top: '110%', left: 0,
                background: '#fff',
                borderRadius: 14,
                border: '0.5px solid #e5e5e5',
                padding: 8,
                minWidth: 220,
                zIndex: 300,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                {SERVICES.map(function(service) {
                  const isActive =
                    location.pathname === service.path;
                  return (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={function() {
                        setDropOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                        borderRadius: 10,
                        textDecoration: 'none',
                        background: isActive
                          ? '#E1F5EE' : 'transparent',
                        marginBottom: 2,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={function(e) {
                        if (!isActive)
                          e.currentTarget.style.background = '#f5f5f5';
                      }}
                      onMouseLeave={function(e) {
                        if (!isActive)
                          e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {service.icon}
                      </span>
                      <div>
                        <p style={{
                          fontSize: 13, fontWeight: 500,
                          color: isActive ? '#0F6E56' : '#222',
                          margin: 0,
                        }}>
                          {lang === 'tamil'
                            ? service.tamil
                            : service.english}
                        </p>
                      </div>
                      {isActive && (
                        <span style={{
                          marginLeft: 'auto',
                          color: '#1D9E75',
                          fontSize: 12,
                        }}>
                          ✓
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* About Us */}
          <Link to="/about"
            style={{
              color: location.pathname === '/about'
                ? '#fff' : 'rgba(255,255,255,0.85)',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 8,
              background: location.pathname === '/about'
                ? 'rgba(255,255,255,0.2)' : 'transparent',
              fontWeight: location.pathname === '/about'
                ? 500 : 400,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            ℹ️ {lang === 'tamil' ? 'எங்களை பற்றி' : 'About Us'}
          </Link>
        </div>

        {/* Right Side */}
        <div style={{
          display: 'flex',
          alignItems: 'center', gap: 8,
          flexShrink: 0,
        }}>

          {/* Language Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 20, padding: 3, gap: 2,
          }}>
            <button
              onClick={function() { switchLang('tamil'); }}
              style={{
                padding: '4px 12px', borderRadius: 16,
                border: 'none', fontSize: 11,
                fontWeight: 500, cursor: 'pointer',
                background: lang === 'tamil'
                  ? '#fff' : 'transparent',
                color: lang === 'tamil'
                  ? '#1D9E75' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              தமிழ்
            </button>
            <button
              onClick={function() { switchLang('english'); }}
              style={{
                padding: '4px 12px', borderRadius: 16,
                border: 'none', fontSize: 11,
                fontWeight: 500, cursor: 'pointer',
                background: lang === 'english'
                  ? '#fff' : 'transparent',
                color: lang === 'english'
                  ? '#1D9E75' : '#fff',
                transition: 'all 0.15s',
              }}
            >
              EN
            </button>
          </div>

          {/* Login / User */}
          {token ? (
            <div style={{
              display: 'flex',
              alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 30, height: 30,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                color: '#fff', fontSize: 13,
                fontWeight: 500,
              }}>
                {name ? name.charAt(0).toUpperCase() : 'F'}
              </div>
              <button onClick={logout} style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none', color: '#fff',
                padding: '5px 12px', borderRadius: 20,
                fontSize: 11, cursor: 'pointer',
                fontWeight: 500,
              }}>
                {lang === 'tamil' ? 'வெளியேறு' : 'Logout'}
              </button>
            </div>
          ) : (
            <Link to="/login" style={{
              background: '#fff',
              color: '#1D9E75',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              {lang === 'tamil'
                ? 'உள்நுழைய' : 'Login'}
            </Link>
          )}
        </div>
      </nav>

      {/* Close dropdown when clicking outside */}
      {dropOpen && (
        <div
          onClick={function() { setDropOpen(false); }}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 199,
          }}
        />
      )}
    </>
  );
}