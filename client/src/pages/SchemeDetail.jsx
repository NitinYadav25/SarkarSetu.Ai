import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, ExternalLink, Star } from 'lucide-react';
import API from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/schemes/${id}`)
      .then(res => setScheme(res.data.scheme))
      .catch(() => { toast.error(language === 'hi' ? 'योजना नहीं मिली!' : 'Scheme not found!'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id, language, navigate]);

  if (loading) return <div style={{ padding: '4rem' }}><LoadingSpinner text={language === 'hi' ? 'योजना का विवरण लोड हो रहा है...' : 'Loading scheme details...'} /></div>;
  if (!scheme) return null;

  const getDeadlineStatus = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: language === 'hi' ? 'समाप्त' : 'Expired', color: '#ef4444' };
    if (diffDays === 0) return { label: language === 'hi' ? 'आज समाप्त' : 'Ends Today', color: '#f59e0b' };
    if (diffDays <= 7) return { label: language === 'hi' ? `${diffDays} दिन में समाप्त` : `Ends in ${diffDays}d`, color: '#f59e0b' };
    return { label: (language === 'hi' ? 'डेडलाइन: ' : 'Deadline: ') + end.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: '#10b981' };
  };

  const deadline = getDeadlineStatus(scheme.applicationEnd);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="fade-in-up" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> {language === 'hi' ? 'पीछे' : 'Back'}
      </button>

      {/* Top card */}
      <div className="glass-card fade-in-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div className="responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', textTransform: 'uppercase', background: 'var(--primary-light)', padding: '2px 10px', borderRadius: '4px' }}>
                {scheme.category} {language === 'hi' ? 'श्रेणी' : 'Category'}
              </span>
              {deadline && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'white', background: deadline.color, padding: '2px 10px', borderRadius: '4px' }}>
                  {deadline.label}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
              {scheme.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{scheme.description}</p>
          </div>
          {/* Quick eligibility */}
          <div style={{ background: 'var(--primary-light)', borderRadius: '1rem', padding: '1rem 1.25rem', minWidth: '180px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a56db', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {language === 'hi' ? 'पात्रता सारांश' : 'Eligibility Summary'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#1239ab', fontWeight: 500 }}>
              <span>📅 {language === 'hi' ? 'उम्र' : 'Age'}: {scheme.minAge}–{scheme.maxAge || 120} {language === 'hi' ? 'वर्ष' : 'years'}</span>
              <span>💰 {language === 'hi' ? 'आय' : 'Income'}: ≤ ₹{Number(scheme.maxIncome).toLocaleString('en-IN')}/{language === 'hi' ? 'वर्ष' : 'yr'}</span>
              <span>🗺️ {language === 'hi' ? 'राज्य' : 'State'}: {scheme.state.join(', ')}</span>
              <span>💼 {language === 'hi' ? 'के लिए' : 'For'}: {scheme.occupation.join(', ')}</span>
              {scheme.applicationEnd && (
                <span style={{ color: deadline.color, fontWeight: 700 }}>⏳ {language === 'hi' ? 'डेडलाइन' : 'Deadline'}: {new Date(scheme.applicationEnd).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Benefits */}
        <div className="glass-card fade-in-up" style={{ padding: '1.75rem', animationDelay: '0.1s' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#f59e0b" /> {language === 'hi' ? 'लाभ' : 'Benefits'}
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {scheme.benefits.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} color="#10b981" style={{ marginTop: '2px', flexShrink: 0 }} />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Required Documents */}
        <div className="glass-card fade-in-up" style={{ padding: '1.75rem', animationDelay: '0.2s' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#1a56db" /> {language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}
          </h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {scheme.documents.map((doc, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a56db', flexShrink: 0 }} />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Apply button */}
      <div className="fade-in-up responsive-flex" style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', animationDelay: '0.3s' }}>
        <a href={scheme.applyLink || 'https://india.gov.in'} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}>
          {language === 'hi' ? 'आधिकारिक पोर्टल पर अभी आवेदन करें' : 'Apply Now on Official Portal'} <ExternalLink size={17} />
        </a>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
        </button>
      </div>
    </div>
  );
};

export default SchemeDetail;
