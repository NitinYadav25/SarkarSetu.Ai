import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, ExternalLink, Star } from 'lucide-react';
import API from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/schemes/${id}`)
      .then(res => setScheme(res.data.scheme))
      .catch(() => { toast.error('Scheme not found!'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '4rem' }}><LoadingSpinner text="Loading scheme details..." /></div>;
  if (!scheme) return null;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="fade-in-up" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      {/* Top card */}
      <div className="glass-card fade-in-up" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div className="responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px', color: '#1a56db', textTransform: 'uppercase', background: 'var(--primary-light)', padding: '2px 10px', borderRadius: '4px' }}>
              {scheme.category} Category
            </span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
              {scheme.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{scheme.description}</p>
          </div>
          {/* Quick eligibility */}
          <div style={{ background: 'var(--primary-light)', borderRadius: '1rem', padding: '1rem 1.25rem', minWidth: '180px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a56db', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Eligibility Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#1239ab', fontWeight: 500 }}>
              <span>📅 Age: {scheme.minAge}–{scheme.maxAge || 120} years</span>
              <span>💰 Income: ≤ ₹{Number(scheme.maxIncome).toLocaleString('en-IN')}/yr</span>
              <span>🗺️ State: {scheme.state.join(', ')}</span>
              <span>💼 For: {scheme.occupation.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* Benefits */}
        <div className="glass-card fade-in-up" style={{ padding: '1.75rem', animationDelay: '0.1s' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} color="#f59e0b" /> Benefits
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
            <FileText size={18} color="#1a56db" /> Required Documents
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
          Apply Now on Official Portal <ExternalLink size={17} />
        </a>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  );
};

export default SchemeDetail;
