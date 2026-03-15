import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';
import { Check, ShieldCheck } from 'lucide-react';

const UserSignup = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', aadharNumber: '',
    age: '', income: '', gender: 'Male', category: 'General',
    occupation: 'Student', state: '', maritalStatus: 'Single'
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [otp, setOtp] = useState('');
  
  const { userLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.aadharNumber || !form.age || !form.income || !form.occupation || !form.state) {
      return toast.error('Please fill all mandatory fields');
    }
    if (form.aadharNumber.length !== 12) {
      return toast.error('Aadhar Number must be exactly 12 digits');
    }

    setLoading(true);
    try {
      const res = await API.post('/user/send-otp', form);
      toast.success(res.data.message || 'OTP Sent!');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Please enter a valid 6-digit OTP');

    setLoading(true);
    try {
      const res = await API.post('/user/register', { aadharNumber: form.aadharNumber, otp });
      userLogin(res.data.user, res.data.token);
      toast.success('Profile created successfully! 🎉');
      navigate('/recommendations');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP or Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "form-input";
  const labelStyle = { fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '4px', display: 'block' };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '700px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t.signupTitle}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t.signupSub}</p>
        </div>

        <form onSubmit={handleSendOtp} className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          {/* Account Details */}
          <div style={{ gridColumn: 'span 2' }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#1a56db' }}>1. {t.navSubtitle.split(' ')[0]} Details</h3></div>
          
          <div><label style={labelStyle}>{t.fullName} *</label><input className={inputStyle} type="text" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required disabled={step===2}/></div>
          <div><label style={labelStyle}>{t.emailLabel} *</label><input className={inputStyle} type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} required disabled={step===2}/></div>
          <div><label style={labelStyle}>{t.passwordLabel} *</label><input className={inputStyle} type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} required disabled={step===2}/></div>
          <div><label style={labelStyle}>Aadhar Number (12 Digits) *</label><input className={inputStyle} type="text" maxLength={12} pattern="\d{12}" title="12 digit Aadhar Number" placeholder="0000 0000 0000" value={form.aadharNumber} onChange={e=>setForm({...form, aadharNumber: e.target.value.replace(/\D/g, '')})} required disabled={step===2}/></div>

          {/* Demographics */}
          <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}><h3 style={{ fontSize: '1.1rem', fontWeight: 700, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', color: '#1a56db' }}>2. Eligibility Criteria</h3></div>
          
          <div><label style={labelStyle}>{t.ageLabel} *</label><input className={inputStyle} type="number" min="1" max="120" value={form.age} onChange={e=>setForm({...form, age: e.target.value})} required disabled={step===2}/></div>
          <div><label style={labelStyle}>{t.incomeLabel} *</label><input className={inputStyle} type="number" min="0" value={form.income} onChange={e=>setForm({...form, income: e.target.value})} required disabled={step===2}/></div>
          
          <div>
            <label style={labelStyle}>Gender *</label>
            <select className={inputStyle} value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})} disabled={step===2}>
              <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t.categoryLabel} *</label>
            <select className={inputStyle} value={form.category} onChange={e=>setForm({...form, category: e.target.value})} disabled={step===2}>
              <option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="Minority">Minority</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>{t.occupationLabel} *</label>
            <select className={inputStyle} value={form.occupation} onChange={e=>setForm({...form, occupation: e.target.value})} disabled={step===2}>
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
            <label style={labelStyle}>{t.stateLabel} *</label>
            <input className={inputStyle} type="text" placeholder="e.g., Maharashtra, Delhi" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} required disabled={step===2}/>
          </div>
          <div>
            <label style={labelStyle}>Marital Status *</label>
            <select className={inputStyle} value={form.maritalStatus} onChange={e=>setForm({...form, maritalStatus: e.target.value})} disabled={step===2}>
              <option value="Single">Single</option><option value="Married">Married</option><option value="Widowed">Widowed</option><option value="Divorced">Divorced</option>
            </select>
          </div>

          <button className="btn-primary" type="submit" disabled={loading || step === 2} style={{ gridColumn: 'span 2', justifyContent: 'center', padding: '1rem', marginTop: '1rem' }}>
            {loading && step === 1 ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Sending OTP...</> : <><ShieldCheck size={18} /> Send Aadhar OTP</>}
          </button>
        </form>

        {step === 1 && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {t.haveAccount} <Link to="/login" style={{ color: '#1a56db', fontWeight: 600 }}>{t.loginBtn}</Link>
          </p>
        )}
      </div>

      {/* OTP Verification Modal Overlay */}
      {step === 2 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card fade-in-up" style={{ width: '100%', maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
            <ShieldCheck size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Verify Aadhar</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              OTP sent to mobile linked with Aadhar <strong>XXXX-XXXX-{form.aadharNumber.slice(-4)}</strong>. <br/><br/>
              <span style={{color: '#ef4444', fontWeight: 'bold'}}>(Demo: Check VS Code Backend Terminal for the OTP)</span>
            </p>

            <form onSubmit={handleVerifyRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                className={inputStyle} 
                type="text" 
                maxLength={6} 
                placeholder="Enter 6-digit OTP" 
                value={otp} 
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '4px', fontWeight: 700 }} 
                required 
              />
              
              <button className="btn-primary" type="submit" disabled={loading} style={{ justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                {loading ? <><div className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'white', borderTopColor: 'transparent' }} /> Verifying...</> : <><Check size={18} /> Verify & Register</>}
              </button>

              <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem', textDecoration: 'underline' }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSignup;
