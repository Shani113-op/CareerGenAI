import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaCrown } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  if (!user) {
    return (
      <div className="profile-page loading">
        <div className="loader"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="avatar-wrapper">
          <FaUserCircle size={100} className="profile-avatar" />
        </div>
        <h2>{user.name}</h2>
        <div className="profile-info">
          <p><FaEnvelope className="icon" /> {user.email}</p>
          <p><FaPhone className="icon" /> {user.mobile}</p>
          <p className={`badge ${user.isPremium ? 'premium' : 'free'}`}>
            <FaCrown className="icon" />
            {user.isPremium ? 'Premium User' : 'Free User'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
