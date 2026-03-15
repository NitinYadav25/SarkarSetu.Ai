import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Home, LogOut, User, Landmark } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, admin, isUserAuthenticated, userLogout, user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    logout();
    navigate('/');
  };

  const handleUserLogout = () => {
    userLogout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f2460 0%, #1a56db 100%)',
      padding: '0 1.5rem',
      boxShadow: '0 2px 16px rgba(15,36,96,0.3)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="nav-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
            border: '1px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <Landmark size={22} color="#fbbf24" strokeWidth={2.5} />
          </div>
          <div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.5px' }}>
              SarkarSetu
            </span>
            <span style={{ color: '#93c5fd', fontWeight: 400, fontSize: '0.75rem', display: 'block', marginTop: '-2px' }}>
              {t.navSubtitle}
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Home size={16} /> {t.home}
          </Link>
          
          {/* User Links */}
          {isUserAuthenticated && user ? (
            <>
              <Link to="/recommendations" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {t.dashboard}
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.8rem', borderRadius: '50px', gap: '8px', color: 'white', fontSize: '0.85rem', textDecoration: 'none' }}>
                <User size={14} />
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              </Link>
              <button onClick={handleUserLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '50px', padding: '0.35rem 1rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={14} /> {t.logout}
              </button>
            </>
          ) : (
            !isAuthenticated && (
              <>
                <Link to="/signup" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  {t.register}
                </Link>
                <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></span>
                <Link to="/login" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '50px', padding: '0.35rem 1rem', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} /> {t.login}
                </Link>
              </>
            )
          )}

          {/* Admin Links */}
          {isAuthenticated && admin && (
            <>
              <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></span>
              <Link to="/admin" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={15} /> {t.adminPanel}
              </Link>
              <button onClick={handleAdminLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '50px', padding: '0.35rem 1rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={14} /> {t.adminLogout}
              </button>
            </>
          )}

          {/* ── Language Toggle ── */}
          <div
            onClick={toggleLanguage}
            title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '50px',
              padding: '4px 6px 4px 8px',
              cursor: 'pointer',
              userSelect: 'none',
              marginLeft: '4px',
            }}
          >
            <span style={{ color: language === 'en' ? 'white' : 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 700, transition: 'color 0.3s' }}>
              EN
            </span>

            {/* Slider track */}
            <div style={{
              width: 36, height: 20,
              background: language === 'hi' ? '#fbbf24' : 'rgba(255,255,255,0.25)',
              borderRadius: 50,
              position: 'relative',
              transition: 'background 0.3s',
              flexShrink: 0,
            }}>
              {/* Thumb */}
              <div style={{
                position: 'absolute',
                top: 2, left: language === 'hi' ? 18 : 2,
                width: 16, height: 16,
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </div>

            <span style={{ color: language === 'hi' ? '#fbbf24' : 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 700, transition: 'color 0.3s' }}>
              हि
            </span>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
