import { useState, useRef } from 'react';
import API from '../api/axios';
import { useLang } from '../context/LanguageContext';

export default function DiseaseDetect() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const { lang } = useLang();

  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB allowed.');
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError('');
  };

  const handleDetect = async () => {
    if (!image) { setError('Please select an image first.'); return; }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await API.post('/disease/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError('Detection failed. Make sure Python Flask is running on port 5000.');
    }
    setLoading(false);
  };

  const severityColor = conf =>
    conf >= 85 ? '#FCEBEB' : conf >= 70 ? '#FAEEDA' : '#E1F5EE';
  const severityLabel = conf =>
    conf >= 85 ? '🔴 High' : conf >= 70 ? '🟡 Medium' : '🟢 Low';

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: '0 auto' }}>
      <h2>{lang==='tamil' ? '🔬 நோய் கண்டறிதல்' : '🔬 Disease Detection'}</h2>
<button>{lang==='tamil' ? '🔍 நோய் கண்டறி' : '🔍 Detect Disease'}</button>

      <div style={{ background: '#fff', borderRadius: 12,
        border: '0.5px solid #e5e5e5', padding: 24, marginBottom: 20 }}>

        {/* Upload Area */}
        <div onClick={() => fileRef.current.click()}
          style={{ border: '2px dashed #1D9E75', borderRadius: 12,
            padding: 32, textAlign: 'center', cursor: 'pointer',
            background: preview ? '#f9f9f9' : '#f0fdf4',
            marginBottom: 16 }}>
          {preview ? (
            <img src={preview} alt="crop"
              style={{ maxWidth: '100%', maxHeight: 220,
                borderRadius: 8, objectFit: 'contain' }} />
          ) : (
            <>
              <p style={{ fontSize: 36, margin: '0 0 8px' }}>📷</p>
              <p style={{ fontSize: 14, color: '#1D9E75',
                fontWeight: 500, margin: '0 0 4px' }}>
                படம் பதிவேற்றவும் / Upload Crop Photo</p>
              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
                Click to select image (JPG, PNG — max 10MB)</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file"
          accept="image/*" onChange={handleFile}
          style={{ display: 'none' }} />

        {preview && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDetect} disabled={loading}
              style={{ flex: 1, padding: 12,
                background: loading ? '#ccc' : '#1D9E75',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              {loading ? '⏳ Detecting...' : '🔍 நோய் கண்டறி / Detect Disease'}
            </button>
            <button onClick={() => { setPreview(null); setImage(null); setResult(null); }}
              style={{ padding: '12px 18px', background: '#f5f5f5',
                border: 'none', borderRadius: 8,
                cursor: 'pointer', fontSize: 13, color: '#555' }}>
              Clear
            </button>
          </div>
        )}

        {error && <p style={{ color: 'red', fontSize: 12,
          marginTop: 12 }}>{error}</p>}
      </div>

      {result && (
        <div style={{ background: '#fff', borderRadius: 12,
          border: '0.5px solid #e5e5e5', padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 500,
            marginBottom: 16 }}>🧪 கண்டறிதல் முடிவு / Detection Result</h3>

          <div style={{ background: severityColor(result.confidence),
            borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex',
              justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 16, fontWeight: 500,
                  margin: '0 0 4px', color: '#222' }}>{result.disease}</p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                  Confidence: {result.confidence}%
                </p>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>
                {severityLabel(result.confidence)}
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(0,0,0,0.1)',
              borderRadius: 3, marginTop: 10, overflow: 'hidden' }}>
              <div style={{ width: `${result.confidence}%`, height: '100%',
                background: '#1D9E75', borderRadius: 3 }} />
            </div>
          </div>

          <div style={{ background: '#E1F5EE', borderRadius: 10,
            padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500,
              color: '#0F6E56', margin: '0 0 6px' }}>
              💊 சிகிச்சை / Treatment Recommendation
            </p>
            <p style={{ fontSize: 13, color: '#333',
              margin: 0, lineHeight: 1.6 }}>{result.treatment}</p>
          </div>

          <div style={{ background: '#FEF3C7', borderRadius: 10,
            padding: 14 }}>
            <p style={{ fontSize: 12, color: '#92400E', margin: 0 }}>
              ⚠️ குறிப்பு: இது AI கண்டறிதல். உறுதிப்படுத்த
              உங்கள் உள்ளூர் வேளாண் அலுவலரை தொடர்பு கொள்ளுங்கள்.
              <br />Note: This is an AI detection. Please confirm with
              your local agriculture officer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}