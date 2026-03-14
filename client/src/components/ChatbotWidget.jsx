import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../api/axios';

const ChatbotWidget = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // Initialize greeting using the translation dictionary.
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: t.botGreeting }]);
    }
  }, [t.botGreeting, messages.length]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const question = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await API.post('/chatbot', {
        userProfile: user?.profile || { age: 25, income: 100000, state: 'All', category: 'General', occupation: 'other', gender: 'other' },
        availableSchemes: [],
        userQuestion: question,
      });
      setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: t.botError }]);
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => sendMessage(input), 300);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open Chatbot"
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1a56db, #0f2460)',
          border: 'none', cursor: 'pointer', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(26,86,219,0.5)',
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '5.5rem', right: '1.5rem', zIndex: 998,
            width: 'min(360px, calc(100vw - 2rem))',
            height: 480,
            display: 'flex', flexDirection: 'column',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 8px 40px rgba(15,36,96,0.2)',
            border: '1px solid rgba(26,86,219,0.15)',
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease',
          }}
        >
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #0f2460, #1a56db)', padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{t.botTitle}</div>
              <div style={{ color: '#93c5fd', fontSize: '0.72rem' }}>{t.botSubtitle}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #1a56db, #0f2460)' : '#f0f4ff',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '0.625rem 1rem' }}>
                  <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
            <input
              className="form-input"
              placeholder={t.botPlaceholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ flex: 1, fontSize: '0.85rem', padding: '0.6rem 0.875rem' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? 'linear-gradient(135deg, #1a56db, #0f2460)' : '#e2e8f0',
                border: 'none', borderRadius: '0.6rem', padding: '0.6rem 0.875rem',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                color: input.trim() && !loading ? 'white' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
