import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedUserRoute = ({ children }) => {
  const { isUserAuthenticated } = useAuth();
  return isUserAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedUserRoute;
