import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

export default function ForgotPassword() {
  const [step,     setStep]     = useState(1);
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [msg,      setMsg]      = useState('');
  const [isError,  setIsError]  = useState(false);
  const navigate = useNavigate();
  const { lang } = useLang();

  const show = function(text, err) {
    setMsg(text);
    setIsError(err || false);
  };

  const step1 = async function(e) {
    e.preventDefault();
    if (!email.trim()) {
      show(lang==='tamil'
        ? 'மின்னஞ்சல் கொடுங்கள்'
        : 'Enter email', true);
      return;
    }
    setLoading(true); setMsg('');
    try {
      const r = await API.post(
        '/auth/forgot-password',
        { email: email.trim().toLowerCase() });
      if (r.data.success) {
        show(r.data.message, false);
        setStep(2);
      } else {
        show(r.data.message, true);
      }
    } catch (err) {
      show(err.response?.data?.message
        || 'Error. Try again.', true);
    }
    setLoading(false);
  };

  const step2 = async function(e) {
    e.preventDefault();
    if (otp.length !== 6) {
      show(lang==='tamil'
        ? '6 இலக்க OTP கொடுங்கள்'
        : 'Enter 6-digit OTP', true);
      return;
    }
    setLoading(true); setMsg('');
    try {
      const r = await API.post(
        '/auth/verify-otp',
        { email: email.trim().toLowerCase(),
          otp: otp.trim() });
      if (r.data.success) {
        show(lang==='tamil'
          ? '✅ OTP சரியாக உள்ளது!'
          : '✅ OTP verified!', false);
        setStep(3);
      } else {
        show(r.data.message, true);
      }
    } catch {
      show(lang==='tamil'
        ? 'OTP தவறானது'
        : 'Wrong OTP. Try again.', true);
    }
    setLoading(false);
  };

  const step3 = async function(e) {
    e.preventDefault();
    if (password.length < 6) {
      show(lang==='tamil'
        ? 'குறைந்தது 6 எழுத்து'
        : 'Min 6 characters', true);
      return;
    }
    if (password !== confirm) {
      show(lang==='tamil'
        ? 'கடவுச்சொல் ஒத்துவரவில்லை'
        : 'Passwords do not match', true);
      return;
    }
    setLoading(true); setMsg('');
    try {
      const r = await API.post(
        '/auth/reset-password',
        { email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword: password });
      if (r.data.success) {
        setStep(4);
      } else {
        show(r.data.message, true);
      }
    } catch {
      show('Error. Try again.', true);
    }
    setLoading(false);
  };

  const inp = {
    width:'100%', padding:'11px 14px',
    borderRadius:8, border:'1.5px solid #ddd',
    fontSize:14, outline:'none',
    boxSizing:'border-box',
    background:'#FAFAFA', color:'#222',
  };
  const lbl = {
    fontSize:12, color:'#555',
    display:'block', marginBottom:6,
    fontWeight:500,
  };
  const btn = {
    width:'100%', padding:14,
    background: loading ? '#9CA3AF' : '#1D9E75',
    color:'#fff', border:'none',
    borderRadius:12, fontSize:15,
    fontWeight:500,
    cursor: loading ? 'not-allowed' : 'pointer',
  };

  if (step === 4) {
    return (
      <div style={{
        minHeight:'100vh', display:'flex',
        alignItems:'center', justifyContent:'center',
        background:
          'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      }}>
        <div style={{
          background:'#fff', borderRadius:20,
          padding:'40px 32px', width:380,
          textAlign:'center',
          border:'0.5px solid #e5e5e5',
        }}>
          <div style={{ fontSize:72 }}>🎉</div>
          <h2 style={{
            color:'#1D9E75',
            margin:'12px 0 8px',
          }}>
            {lang==='tamil'
              ? 'கடவுச்சொல் மாறியது!'
              : 'Password Changed!'}
          </h2>
          <p style={{
            color:'#555', fontSize:14,
            lineHeight:1.6, margin:'0 0 8px',
          }}>
            {lang==='tamil'
              ? 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.'
              : 'Your password has been changed successfully.'}
          </p>
          <p style={{
            color:'#1D9E75', fontSize:13,
            margin:'0 0 24px',
          }}>
            {lang==='tamil'
              ? '📧 உறுதிப்படுத்தல் மின்னஞ்சல் அனுப்பப்பட்டது.'
              : '📧 Confirmation email sent to your inbox.'}
          </p>
          <button
            onClick={function() {
              navigate('/login');
            }}
            style={btn}
          >
            {lang==='tamil'
              ? '→ உள்நுழைய செல்லுங்கள்'
              : '→ Go to Login'}
          </button>
        </div>
      </div>
    );
  }

  const titles = [
    lang==='tamil'
      ? 'கடவுச்சொல் மறந்துவிட்டதா?'
      : 'Forgot Password?',
    lang==='tamil'
      ? 'OTP சரிபாருங்கள்'
      : 'Verify OTP',
    lang==='tamil'
      ? 'புதிய கடவுச்சொல்'
      : 'New Password',
  ];
  const subs = [
    lang==='tamil'
      ? 'Gmail-க்கு OTP அனுப்பப்படும்'
      : 'OTP will be sent to your Gmail',
    lang==='tamil'
      ? 'Gmail பார்த்து OTP கொடுங்கள்'
      : 'Check Gmail and enter the OTP',
    lang==='tamil'
      ? 'புதிய கடவுச்சொல் உருவாக்குங்கள்'
      : 'Create your new password',
  ];
  const icons = ['🔐','📧','🔑'];

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:
        'linear-gradient(135deg,#f0fdf4,#dcfce7)',
      padding:'20px 16px',
    }}>
      <div style={{
        background:'#fff', borderRadius:20,
        padding:'32px 28px', width:'100%',
        maxWidth:400,
        border:'0.5px solid #e5e5e5',
      }}>

        {/* Step dots */}
        <div style={{
          display:'flex', justifyContent:'center',
          gap:8, marginBottom:24,
        }}>
          {[1,2,3].map(function(s) {
            return (
              <div key={s} style={{
                width: s===step ? 28 : 10,
                height:10, borderRadius:5,
                background: s<=step
                  ? '#1D9E75' : '#e5e5e5',
                transition:'all 0.3s',
              }} />
            );
          })}
        </div>

        {/* Header */}
        <div style={{
          textAlign:'center', marginBottom:24,
        }}>
          <div style={{ fontSize:44 }}>
            {icons[step-1]}
          </div>
          <h2 style={{
            color:'#1D9E75',
            margin:'8px 0 4px', fontSize:20,
          }}>
            {titles[step-1]}
          </h2>
          <p style={{
            color:'#888', fontSize:12, margin:0,
          }}>
            {subs[step-1]}
          </p>
        </div>

        {/* Message */}
        {msg && (
          <div style={{
            padding:'10px 14px', borderRadius:8,
            fontSize:13, marginBottom:16,
            background: isError
              ? '#FCEBEB' : '#E1F5EE',
            color: isError
              ? '#991B1B' : '#0F6E56',
            borderLeft:'3px solid '
              + (isError ? '#E24B4A' : '#1D9E75'),
          }}>
            {msg}
          </div>
        )}

        {/* STEP 1 */}
        {step===1 && (
          <form onSubmit={step1}>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>
                {lang==='tamil'
                  ? 'மின்னஞ்சல்' : 'Email'}
              </label>
              <input type="email"
                value={email} required
                onChange={function(e) {
                  setEmail(e.target.value);
                }}
                placeholder="example@gmail.com"
                style={inp}
              />
            </div>
            <button type="submit"
              disabled={loading} style={btn}>
              {loading
                ? (lang==='tamil'
                  ? 'அனுப்புகிறது...'
                  : 'Sending...')
                : (lang==='tamil'
                  ? 'OTP அனுப்பு'
                  : 'Send OTP')}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step===2 && (
          <form onSubmit={step2}>
            <div style={{
              background:'#E1F5EE',
              borderRadius:10, padding:12,
              marginBottom:16, textAlign:'center',
            }}>
              <p style={{
                fontSize:12, color:'#0F6E56',
                margin:0,
              }}>
                📧 OTP sent to: <b>{email}</b>
              </p>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>
                {lang==='tamil'
                  ? '6 இலக்க OTP'
                  : '6-Digit OTP'}
              </label>
              <input type="text"
                value={otp} maxLength={6}
                onChange={function(e) {
                  setOtp(e.target.value
                    .replace(/\D/g,'')
                    .slice(0,6));
                }}
                placeholder="000000"
                style={{
                  ...inp,
                  textAlign:'center',
                  fontSize:32,
                  letterSpacing:12,
                  fontWeight:700,
                }}
              />
            </div>
            <button type="submit"
              disabled={loading} style={btn}>
              {loading
                ? (lang==='tamil'
                  ? 'சரிபார்க்கிறது...'
                  : 'Verifying...')
                : (lang==='tamil'
                  ? 'OTP சரிபார்'
                  : 'Verify OTP')}
            </button>
            <button type="button"
              onClick={step1} disabled={loading}
              style={{
                width:'100%', marginTop:10,
                padding:10, background:'none',
                border:'none', fontSize:13,
                color:'#1D9E75', cursor:'pointer',
                fontWeight:500,
              }}>
              🔄 {lang==='tamil'
                ? 'மீண்டும் OTP அனுப்பு'
                : 'Resend OTP'}
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step===3 && (
          <form onSubmit={step3}>
            <div style={{ marginBottom:14 }}>
              <label style={lbl}>
                {lang==='tamil'
                  ? 'புதிய கடவுச்சொல்'
                  : 'New Password'}
              </label>
              <input type="password"
                value={password} required
                onChange={function(e) {
                  setPassword(e.target.value);
                }}
                placeholder={lang==='tamil'
                  ? 'குறைந்தது 6 எழுத்து'
                  : 'Min 6 characters'}
                style={inp}
              />
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={lbl}>
                {lang==='tamil'
                  ? 'கடவுச்சொல் உறுதி'
                  : 'Confirm Password'}
              </label>
              <input type="password"
                value={confirm} required
                onChange={function(e) {
                  setConfirm(e.target.value);
                }}
                placeholder={lang==='tamil'
                  ? 'மீண்டும் கொடுங்கள்'
                  : 'Repeat password'}
                style={{
                  ...inp,
                  borderColor:
                    confirm && password!==confirm
                      ? '#E24B4A' : '#ddd',
                }}
              />
              {confirm && password!==confirm && (
                <p style={{
                  color:'#E24B4A', fontSize:11,
                  margin:'4px 0 0',
                }}>
                  {lang==='tamil'
                    ? '❌ ஒத்துவரவில்லை'
                    : '❌ Does not match'}
                </p>
              )}
              {confirm && password===confirm && (
                <p style={{
                  color:'#1D9E75', fontSize:11,
                  margin:'4px 0 0',
                }}>
                  {lang==='tamil'
                    ? '✅ ஒத்துவருகிறது'
                    : '✅ Passwords match'}
                </p>
              )}
            </div>
            <button type="submit"
              disabled={loading} style={btn}>
              {loading
                ? (lang==='tamil'
                  ? 'மாற்றுகிறது...'
                  : 'Changing...')
                : (lang==='tamil'
                  ? 'கடவுச்சொல் மாற்று'
                  : 'Change Password')}
            </button>
          </form>
        )}

        <div style={{
          textAlign:'center', marginTop:16,
        }}>
          <Link to="/login" style={{
            color:'#888', fontSize:12,
            textDecoration:'none',
          }}>
            {lang==='tamil'
              ? '← உள்நுழைய திரும்பு'
              : '← Back to Login'}
          </Link>
        </div>
      </div>
    </div>
  );
}