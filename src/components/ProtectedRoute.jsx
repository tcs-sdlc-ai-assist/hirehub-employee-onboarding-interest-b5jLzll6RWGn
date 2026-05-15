import { useState } from 'react';
import { isAuthenticated } from '../utils/adminAuth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

export default function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}