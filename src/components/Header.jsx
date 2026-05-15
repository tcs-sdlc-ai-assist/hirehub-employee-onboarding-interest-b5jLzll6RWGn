import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/adminAuth';

export default function Header() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setAuthenticated(isAuthenticated());
    };
    checkAuth();
  });

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        HireHub
      </NavLink>
      <ul className="navbar-links">
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/apply">Apply</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin</NavLink>
        </li>
        <li>
          {authenticated ? (
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <NavLink to="/admin">Login</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}