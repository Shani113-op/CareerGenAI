// src/components/Footer.js

import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} CareerDendro. All rights reserved.</p>
      <div className="footer-links">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <a href="mailto:contact@careerdendro.com">Contact Us</a>
      </div>
    </footer>
  );
};

export default Footer;
