const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <div className="spinner" />
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>
  </div>
);

export default LoadingSpinner;
