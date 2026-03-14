import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Home, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, admin, isUserAuthenticated, userLogout, user } = useAuth();
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
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
          }}>🇮🇳</div>
          <div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.5px' }}>
              SarkarSetu
            </span>
            <span style={{ color: '#93c5fd', fontWeight: 400, fontSize: '0.75rem', display: 'block', marginTop: '-2px' }}>
              AI-Powered Scheme Navigator
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Home size={16} /> Home
          </Link>
          
          {/* User Links */}
          {isUserAuthenticated && user ? (
            <>
              <Link to="/recommendations" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Dashboard
              </Link>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.8rem', borderRadius: '50px', gap: '8px', color: 'white', fontSize: '0.85rem', textDecoration: 'none' }}>
                <User size={14} />
                <span style={{ fontWeight: 600 }}>{user.name}</span>
              </Link>
              <button onClick={handleUserLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '50px', padding: '0.35rem 1rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            !isAuthenticated && (
              <>
                <Link to="/signup" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Register
                </Link>
                <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></span>
                <Link to="/login" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '50px', padding: '0.35rem 1rem', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <User size={14} /> Login
                </Link>
              </>
            )
          )}

          {/* Admin Links */}
          {isAuthenticated && admin && (
            <>
              <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></span>
              <Link to="/admin" style={{ color: '#fbbf24', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Shield size={15} /> Admin Panel
              </Link>
              <button onClick={handleAdminLogout} style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', borderRadius: '50px', padding: '0.35rem 1rem', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <LogOut size={14} /> Admin Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
