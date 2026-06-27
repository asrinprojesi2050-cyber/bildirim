import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bell, Settings, Code, LogOut } from 'lucide-react';
import DashboardHome from './pages/DashboardHome';
import Notifications from './pages/Notifications';
import Installation from './pages/Installation';
import Auth from './pages/Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [storeId, setStoreId] = useState(localStorage.getItem('storeId'));

  useEffect(() => {
    // URL'den token ve storeId'yi çek (İkas Embedded App için)
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlStoreId = urlParams.get('storeId');
    const urlEmail = urlParams.get('email');

    if (urlToken && urlStoreId) {
      localStorage.setItem('token', urlToken);
      localStorage.setItem('storeId', urlStoreId);
      if (urlEmail) localStorage.setItem('email', urlEmail);
      
      setToken(urlToken);
      setStoreId(urlStoreId);

      // URL'yi temizle (Token'ı gizle)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = (data) => {
    setToken(data.token);
    setStoreId(data.storeId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('storeId');
    localStorage.removeItem('email');
    setToken(null);
    setStoreId(null);
  };

  if (!token) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo" style={{ marginBottom: '10px' }}>
            <Bell size={28} color="#8a2be2" />
            Bidlirim
          </div>
          <div style={{ padding: '0 24px 30px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Store ID:<br/>
            <strong style={{ color: 'var(--primary-color)' }}>{storeId}</strong>
          </div>
          
          <nav className="nav-links">
            <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
              <LayoutDashboard size={20} />
              Gösterge Paneli
            </NavLink>
            <NavLink to="/notifications" className={({isActive}) => isActive ? 'active' : ''}>
              <Bell size={20} />
              Bildirimler
            </NavLink>
            <NavLink to="/installation" className={({isActive}) => isActive ? 'active' : ''}>
              <Code size={20} />
              Kurulum
            </NavLink>
            
            
            {/* Gömülü İkas modundayken Çıkış Yap butonunu gizle (İsteğe bağlı, şimdilik URL'de iframe kontrolü yapmıyoruz ama estetik için ayırıyoruz) */}
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ marginTop: 'auto', color: '#ef4444' }}>
              <LogOut size={20} />
              Çıkış Yap
            </a>
          </nav>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardHome storeId={storeId} />} />
            <Route path="/notifications" element={<Notifications storeId={storeId} />} />
            <Route path="/installation" element={<Installation storeId={storeId} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
