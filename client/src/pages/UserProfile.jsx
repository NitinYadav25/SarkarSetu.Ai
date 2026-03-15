import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Mail, ShieldCheck, Edit3, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, userLogin } = useAuth();
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: '', email: '', aadharNumber: '', age: '', income: '', 
    gender: 'Male', category: 'General', occupation: 'Student', state: '', maritalStatus: 'Single'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('sarkarsetuUserToken')}` }
        });
        if (res.data.success) {
          setForm(res.data.user);
        }
      } catch (err) {
        toast.error('Failed to load profile details');
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/user/profile', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('sarkarsetuUserToken')}` }
      });
      if (res.data.success) {
        toast.success(language === 'hi' ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!');
        // Update global context so Navbar and Dashboard reflect new info
        userLogin(res.data.user, localStorage.getItem('sarkarsetuUserToken'));
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(language === 'hi' ? 'प्रोफ़ाइल अपडेट करने में विफल' : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `form-input ${!isEditing ? 'disabled-input' : ''}`;
  const labelStyle = { fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px', display: 'block' };

  if (fetching) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', padding: '5rem 0', textAlign: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3, margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{language === 'hi' ? 'आपकी प्रोफ़ाइल लोड की जा रही है...' : 'Loading your profile...'}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem' }}>
        
        {/* Header */}
        <div className="responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f2460', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={28} color="#1a56db" /> {language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{language === 'hi' ? 'अपने जनसांख्यिकीय विवरण देखें या अपडेट करें।' : 'View or update your demographic details.'}</p>
          </div>
          
          <button 
            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)} 
            className={isEditing ? 'btn-secondary' : 'btn-primary'}
            style={{ padding: '0.6rem 1.25rem' }}
          >
            {isEditing ? (language === 'hi' ? 'संपादन रद्द करें' : 'Cancel Edit') : <><Edit3 size={16} /> {language === 'hi' ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</>}
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* Identity Section (Read Only) */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(26,86,219,0.04)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(26,86,219,0.1)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a56db', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> {language === 'hi' ? 'सत्यापित पहचान' : 'Verified Identity'} <span style={{fontSize: '0.75rem', fontWeight: 500, background: '#e0f2fe', padding: '2px 8px', borderRadius: '50px'}}>{language === 'hi' ? '(बदला नहीं जा सकता)' : '(Cannot be changed)'}</span>
            </h3>
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t.emailLabel}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1rem', background: '#f3f4f6', borderRadius: '8px', color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Mail size={16} /> {form.email}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Aadhar Number</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1rem', background: '#f3f4f6', borderRadius: '8px', color: '#6b7280', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '2px' }}>
                  <ShieldCheck size={16} /> XXXX XXXX {form.aadharNumber?.slice(-4) || 'XXXX'}
                </div>
              </div>
            </div>
          </div>

          {/* Editable Demographics */}
          <div>
            <label style={labelStyle}>{t.fullName}</label>
            <input className={inputStyle} type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} disabled={!isEditing} required />
          </div>
          <div>
            <label style={labelStyle}>{t.ageLabel}</label>
            <input className={inputStyle} type="number" min="1" max="120" value={form.age} onChange={e=>setForm({...form, age: e.target.value})} disabled={!isEditing} required />
          </div>
          <div>
            <label style={labelStyle}>{t.incomeLabel}</label>
            <input className={inputStyle} type="number" min="0" value={form.income} onChange={e=>setForm({...form, income: e.target.value})} disabled={!isEditing} required />
          </div>
          <div>
            <label style={labelStyle}>{t.occupationLabel}</label>
            <select className={inputStyle} value={form.occupation} onChange={e=>setForm({...form, occupation: e.target.value})} disabled={!isEditing}>
              <option value="Student">Student</option>
              <option value="Farmer">Farmer / Agriculture</option>
              <option value="Business">Business / Entrepreneur</option>
              <option value="Self-Employed">Self-Employed</option>
              <option value="Street Vendor">Street Vendor</option>
              <option value="Labour">Labour / Daily Wager</option>
              <option value="Service">Service / Private Job</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Homemaker">Homemaker</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t.stateLabel}</label>
            <input className={inputStyle} type="text" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} disabled={!isEditing} required />
          </div>
          
          <div>
            <label style={labelStyle}>Gender</label>
            <select className={inputStyle} value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} disabled={!isEditing}>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t.categoryLabel}</label>
            <select className={inputStyle} value={form.category} onChange={e=>setForm({...form, category: e.target.value})} disabled={!isEditing}>
              <option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="Minority">Minority</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Marital Status</label>
            <select className={inputStyle} value={form.maritalStatus} onChange={e=>setForm({...form, maritalStatus: e.target.value})} disabled={!isEditing}>
              <option value="Single">Single</option><option value="Married">Married</option><option value="Widowed">Widowed</option><option value="Divorced">Divorced</option>
            </select>
          </div>

          {/* Action Button */}
          {isEditing && (
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" type="submit" disabled={loading} style={{ padding: '0.8rem 2rem' }}>
                {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Save size={18} /> {language === 'hi' ? 'बदलाव सुरक्षित करें' : 'Save Changes'}</>}
              </button>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .disabled-input {
          background-color: #f9fafb !important;
          border-color: #e5e7eb !important;
          color: #4b5563 !important;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
