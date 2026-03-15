import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

const SchemeCard = ({ scheme, matchPercent, aiSummary, index = 0 }) => {
  const navigate = useNavigate();

  const getMatchColor = (pct) => {
    if (pct >= 80) return '#10b981';
    if (pct >= 55) return '#f59e0b';
    return '#ef4444';
  };

  const getDeadlineStatus = (endDate) => {
    if (!endDate) return null;
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', color: '#ef4444' };
    if (diffDays === 0) return { label: 'Ends Today', color: '#f59e0b' };
    if (diffDays <= 7) return { label: `Ends in ${diffDays}d`, color: '#f59e0b' };
    return { label: `${end.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, color: '#10b981' };
  };

  const deadline = getDeadlineStatus(scheme.applicationEnd);

  return (
    <div
      className="glass-card fade-in-up"
      style={{
        padding: '1.5rem',
        animationDelay: `${index * 0.1}s`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px',
              color: '#1a56db', textTransform: 'uppercase', background: 'var(--primary-light)',
              padding: '2px 8px', borderRadius: '4px',
            }}>
              {scheme.category}
            </span>
            {deadline && (
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: 'white', background: deadline.color,
                padding: '2px 8px', borderRadius: '4px',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {deadline.label}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.4rem', color: 'var(--text-primary)', lineHeight: 1.25 }}>
            {scheme.name}
          </h3>
        </div>
        {/* Match % badge */}
        <div style={{
          minWidth: '64px', textAlign: 'center',
          background: `${getMatchColor(matchPercent)}18`,
          border: `2px solid ${getMatchColor(matchPercent)}`,
          borderRadius: '0.75rem', padding: '0.4rem 0.6rem',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: getMatchColor(matchPercent), lineHeight: 1 }}>
            {matchPercent}%
          </div>
          <div style={{ fontSize: '0.6rem', color: getMatchColor(matchPercent), fontWeight: 600 }}>Match</div>
        </div>
      </div>

      {/* AI Summary */}
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {aiSummary}
      </p>

      {/* Benefits preview */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
        {scheme.benefits.slice(0, 2).map((b, i) => (
          <span key={i} style={{
            fontSize: '0.75rem', background: '#f0f4ff', color: '#1a56db',
            padding: '3px 10px', borderRadius: '50px', fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <CheckCircle size={11} />
            {b.length > 45 ? b.slice(0, 42) + '...' : b}
          </span>
        ))}
        {scheme.benefits.length > 2 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '3px 0' }}>
            +{scheme.benefits.length - 2} more
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="responsive-flex" style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
        <button
          className="btn-primary"
          style={{ flex: 1, fontSize: '0.875rem', padding: '0.6rem 1rem', justifyContent: 'center' }}
          onClick={() => navigate(`/scheme/${scheme._id}`)}
        >
          View Details <ArrowRight size={15} />
        </button>
        <a
          href={scheme.applyLink || 'https://india.gov.in'}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{ fontSize: '0.875rem', padding: '0.6rem 1rem' }}
        >
          Apply <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};

export default SchemeCard;
