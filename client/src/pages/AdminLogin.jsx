import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language } = useLanguage();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { toast.error(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें!' : 'Please fill all fields!'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.admin, res.data.token);
      toast.success(language === 'hi' ? `स्वागत है, ${res.data.admin.username}! 🎉` : `Welcome, ${res.data.admin.username}! 🎉`);
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || (language === 'hi' ? 'लॉगिन विफल। क्रेडेंशियल्स जांचें।' : 'Login failed. Check credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a56db, #0f2460)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', boxShadow: '0 4px 20px rgba(26,86,219,0.4)',
          }}>
            <Shield size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{language === 'hi' ? 'एडमिन लॉगिन' : 'Admin Login'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>SarkarSetu AI Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <User size={15} /> {language === 'hi' ? 'यूजरनेम' : 'Username'}
            </label>
            <input className="form-input" type="text" placeholder="admin" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Lock size={15} /> {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{ justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem' }}>
            {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> {language === 'hi' ? 'लॉगिन किया जा रहा है...' : 'Logging in...'}</> : <><Shield size={16} /> {language === 'hi' ? 'एडमिन पैनल में लॉगिन करें' : 'Login to Admin Panel'}</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
