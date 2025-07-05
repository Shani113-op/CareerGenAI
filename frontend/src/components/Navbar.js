// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('👋 You have been logged out.');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <NavLink to="/" className="nav-logo-link">CareerGenAi</NavLink>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        {user && <li><NavLink to="/chat" className={({ isActive }) => isActive ? 'active' : ''}>AI Chat</NavLink></li>}
        {user && <li><NavLink to="/interest-form" className={({ isActive }) => isActive ? 'active' : ''}>Interest Form</NavLink></li>}
        {user && <li><NavLink to="/CareerQuiz" className={({ isActive }) => isActive ? 'active' : ''}>Quiz</NavLink></li>}
        {user && <li><NavLink to="/careerDetail" className={({ isActive }) => isActive ? 'active' : ''}>Careers</NavLink></li>}
        {user && <li><NavLink to="/consult" className={({ isActive }) => isActive ? 'active' : ''}>Consultants</NavLink></li>}
        {user && <li><NavLink to="/college" className={({ isActive }) => isActive ? 'active' : ''}>Top College</NavLink></li>}
      </ul>

      {/* Auth / Profile */}
      <div className="navbar-auth">
        {!user ? (
          <>
            <NavLink to="/login" className="auth-button">Login</NavLink>
            <NavLink to="/register" className="auth-button register">Register</NavLink>
          </>
        ) : (
          <div className="profile-wrapper" ref={dropdownRef}>
            <FaUserCircle
              className="profile-icon"
              size={30}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/profile')}>👤 See Profile</button>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
