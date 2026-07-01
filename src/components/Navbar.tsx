import { useState } from 'react';
import '../styles/navbar.css';
import logoImg from '../assets/logo.webp';

function Navbar() {
  const [activeLink, setActiveLink] = useState('#home');
  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        <a href="#home" className="navbar-brand" onClick={() => setActiveLink('#home')}>
          <img src={logoImg} alt="Logo" height="40" style={{ display: 'block', objectFit: 'contain' }} />
          <span>Anti-Social</span>
        </a>
        <div className="navbar-links">
          <a href="#home" className={`navbar-link ${activeLink === '#home' ? 'active' : ''}`}onClick={() => setActiveLink('#home')}>Home</a>
          <a href="#create-post" className={`navbar-link ${activeLink === '#create-post' ? 'active' : ''}`} onClick={() => setActiveLink('#create-post')}>Crear Post</a>
          <a href="#profile" className={`navbar-link ${activeLink === '#profile' ? 'active' : ''}`}onClick={() => setActiveLink('#profile')}>Mi Perfil</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;