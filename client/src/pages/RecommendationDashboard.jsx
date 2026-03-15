import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';
import SchemeCard from '../components/SchemeCard';
import ChatbotWidget from '../components/ChatbotWidget';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const RecommendationDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [results, setResults] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySchemes = async () => {
      try {
        const res = await API.get('/check-eligibility/my-schemes', {
          headers: { Authorization: `Bearer ${localStorage.getItem('sarkarsetuUserToken')}` }
        });
        if (res.data.success) {
          setResults(res.data.results);
          setUserProfile(res.data.userProfile);
        }
      } catch (err) {
        toast.error('Failed to load your matched schemes');
      } finally {
        setLoading(false);
      }
    };
    fetchMySchemes();
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>{language === 'hi' ? 'आपकी प्रोफ़ाइल का विश्लेषण और योजनाएं खोजी जा रही हैं...' : 'Analyzing your profile & finding schemes...'}</p>
        </div>
      ) : (
        <>
          <div className="fade-in-up" style={{ marginBottom: '2rem' }}>
            <div className="responsive-flex" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {results.length > 0 
                    ? (language === 'hi' ? `🎉 ${results.length} योजनाएं मिलीं!` : `🎉 ${results.length} Scheme${results.length > 1 ? 's' : ''} Found!`)
                    : t.noSchemes.split('.')[0]
                  }
                </h1>
                {userProfile && (
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {language === 'hi' ? 'आधारित है:' : 'Based on:'} <strong>{userProfile.occupation}</strong>, {userProfile.state}, ₹{Number(userProfile.income).toLocaleString('en-IN')}/yr, {userProfile.category}, {language === 'hi' ? 'उम्र' : 'Age'}: {userProfile.age}
                  </p>
                )}
              </div>
          {results.length > 0 && (
            <div style={{ background: 'var(--primary-light)', border: '1px solid #1a56db', borderRadius: '0.75rem', padding: '0.5rem 1rem', color: '#1a56db', fontWeight: 600, fontSize: '0.9rem' }}>
              {language === 'hi' ? '🤖 AI-विश्लेषित परिणाम' : '🤖 AI-Analyzed Results'}
            </div>
          )}
        </div>
      </div>

          {/* Results */}
          {results.length === 0 ? (
            <div className="glass-card fade-in-up" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Frown size={52} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {language === 'hi' ? 'कोई योजना मैच नहीं हुई' : 'No Matching Schemes'}
              </h2>
              <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                {t.noSchemes}
              </p>
            </div>
          ) : (
            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {results.map(({ scheme, matchPercent, aiSummary }, i) => (
                <SchemeCard key={scheme._id} scheme={scheme} matchPercent={matchPercent} aiSummary={aiSummary} index={i} />
              ))}
            </div>
          )}

          {/* Chatbot Widget */}
          {userProfile && <ChatbotWidget userProfile={userProfile} availableSchemes={results.map(r => r.scheme)} />}
        </>
      )}
    </div>
  );
};

export default RecommendationDashboard;
