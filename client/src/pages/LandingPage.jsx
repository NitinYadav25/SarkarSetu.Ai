import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Search, CheckCircle, Star, Users, FileCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const [currentImage, setCurrentImage] = useState(0);

  const bgImages = [
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595981267035-7b04d84caa4b?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2076&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596422846543-7ecf77861bc9?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop',
  ];

  const steps = [
    {
      icon: <FileCheck size={28} color="#1a56db" />,
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      icon: <Search size={28} color="#1a56db" />,
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      icon: <CheckCircle size={28} color="#1a56db" />,
      title: t.step3Title,
      desc: t.step3Desc,
    },
  ];

  const stats = [
    { icon: <Users size={22} />, value: '10 Cr+', label: t.beneficiaries },
    { icon: <Star size={22} />, value: '100+', label: t.schemes },
    { icon: <CheckCircle size={22} />, value: '98%', label: t.accuracy },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem 6rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Slider */}
        <div className="bg-slider">
          {bgImages.map((img, index) => (
            <div
              key={index}
              className={`bg-slide ${index === currentImage ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        {/* Background decorations */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', zIndex: 1 }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>

          <h1 className="fade-in-up" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '1.25rem', animationDelay: '0.1s' }}>
            {language === 'hi' ? 'आपका हक, ' : 'Apka Hak, '}
            <span style={{ color: '#fbbf24', position: 'relative' }}>
              {language === 'hi' ? 'सीधा आपके पास' : 'Seedha Aapke Paas'}
            </span>
          </h1>

          <p className="fade-in-up" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: '620px', margin: '0 auto 2.5rem', animationDelay: '0.2s' }}>
            {t.heroParagraph}
          </p>

          <div className="fade-in-up responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', animationDelay: '0.3s' }}>
            <button className="btn-primary pulse-ring" style={{ fontSize: '1.05rem', padding: '0.9rem 2.25rem' }} onClick={() => navigate(isUserAuthenticated ? '/recommendations' : '/signup')}>
              {isUserAuthenticated ? t.viewMySchemes : t.checkEligibility} <ArrowRight size={18} />
            </button>
            <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
              {t.browseAllSchemes}
            </a>
          </div>

          {/* Stats row */}
          <div className="fade-in-up responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3.5rem', animationDelay: '0.4s' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ color: 'white', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#93c5fd', marginBottom: '4px' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wave SVG ──────────────────────────────────────────── */}
      <div style={{ marginTop: '-2px', lineHeight: 0, background: 'var(--bg)' }}>
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%' }}>
          <path d="M0 0L60 10.7C120 21 240 43 360 48C480 53 600 43 720 37.3C840 32 960 32 1080 37.3C1200 43 1320 53 1380 58.7L1440 64V80H0V0Z" fill="var(--bg)" />
        </svg>
      </div>

      {/* ── 3-Step Section ────────────────────────────────────── */}
      <section style={{ padding: '3rem 1.5rem 4rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 className="section-heading">{t.howItWorks}</h2>
        <p className="section-sub">{t.howItWorksSub}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {steps.map((step, i) => (
            <div key={i} className="glass-card fade-in-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: `${i * 0.15}s` }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--primary-light)', margin: '0 auto 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(26,86,219,0.15)',
              }}>
                {step.icon}
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#1a56db', color: 'white',
                fontSize: '0.85rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.75rem',
              }}>
                {i + 1}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section style={{ padding: '0 1.5rem 4rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a56db, #0f2460)',
          borderRadius: '1.5rem', padding: '3rem 2rem',
          textAlign: 'center', boxShadow: '0 8px 40px rgba(26,86,219,0.3)',
        }}>
          <h2 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {t.ctaHeading}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '1.75rem' }}>
            {t.ctaSub}
          </p>
          <button className="btn-primary mobile-full-width" style={{ background: '#fbbf24', color: '#0f2460', boxShadow: '0 4px 20px rgba(251,191,36,0.4)', fontSize: '1rem', padding: '0.9rem 2.5rem' }} onClick={() => navigate(isUserAuthenticated ? '/recommendations' : '/signup')}>
            {isUserAuthenticated ? t.goToDashboard : t.startNow} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer style={{ background: '#0f2460', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '1.5rem', fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          {t.footerText}
        </div>
        <div>
          <Link to="/admin/login" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.75rem' }}>{t.adminAccess}</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
