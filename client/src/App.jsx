import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import UserSignup from './pages/UserSignup';
import UserLogin from './pages/UserLogin';
import UserProfile from './pages/UserProfile';
import RecommendationDashboard from './pages/RecommendationDashboard';
import SchemeDetail from './pages/SchemeDetail';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import ProtectedUserRoute from './components/ProtectedUserRoute';
import ChatbotWidget from './components/ChatbotWidget';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/login" element={<UserLogin />} />
            <Route
              path="/recommendations"
              element={<ProtectedUserRoute><RecommendationDashboard /></ProtectedUserRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedUserRoute><UserProfile /></ProtectedUserRoute>}
            />
            <Route path="/scheme/:id" element={<SchemeDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            {/* 404 */}
            <Route path="*" element={
              <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem' }}>🔍</div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '1rem' }}>Page Not Found</h1>
                <a href="/" style={{ marginTop: '1rem', color: '#1a56db', fontWeight: 600 }}>← Go Home</a>
              </div>
            } />
          </Routes>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Inter, sans-serif', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }, success: { iconTheme: { primary: '#10b981', secondary: 'white' } }, error: { iconTheme: { primary: '#ef4444', secondary: 'white' } } }} />
          <ChatbotWidget />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
