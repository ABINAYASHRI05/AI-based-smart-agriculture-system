import { BrowserRouter, Routes, Route, Navigate }
  from 'react-router-dom';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/Dashboard';
import CropRecommend from './pages/CropRecommend';
import DiseaseDetect from './pages/DiseaseDetect';
import MarketPrices  from './pages/MarketPrices';
import Subsidies     from './pages/Subsidies';
import SatelliteFarm from './pages/SatelliteFarm';
import AboutUs       from './pages/AboutUs';
import Navbar        from './components/Navbar';
import VoiceGuide    from './components/VoiceGuide';
import ForgotPassword from './pages/ForgotPassword';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function PrivateLayout({ children }) {
  const token = localStorage.getItem('agri_token');
  if (!token) {
    sessionStorage.setItem(
      'redirect_after_login',
      window.location.pathname
    );
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <VoiceGuide />
      <Routes>
        <Route path="/login"
          element={<Login />} />
        <Route path="/register"
          element={<Register />} />
          <Route path="/forgot-password"
  element={<ForgotPassword />} />
        <Route path="/" element={
          <PublicLayout>
            <Dashboard />
          </PublicLayout>
        }/>
        <Route path="/market" element={
          <PublicLayout>
            <MarketPrices />
          </PublicLayout>
        }/>
        <Route path="/subsidies" element={
          <PublicLayout>
            <Subsidies />
          </PublicLayout>
        }/>
        <Route path="/about" element={
          <PublicLayout>
            <AboutUs />
          </PublicLayout>
        }/>
        <Route path="/crop" element={
          <PrivateLayout>
            <CropRecommend />
          </PrivateLayout>
        }/>
        <Route path="/disease" element={
          <PrivateLayout>
            <DiseaseDetect />
          </PrivateLayout>
        }/>
        <Route path="/satellite" element={
          <PrivateLayout>
            <SatelliteFarm />
          </PrivateLayout>
        }/>
        <Route path="*"
          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}