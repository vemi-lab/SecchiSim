import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomDrawer.css';
import logo from '../assets/avatar.jpg'

export default function CustomDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isCourseMaterialOpen, setIsCourseMaterialOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName); // Set active link when clicked
    if (linkName === 'Course Material') {
      setIsCourseMaterialOpen(!isCourseMaterialOpen);
    } else {
      setIsCourseMaterialOpen(false); // Close subsections
    }
  };

  const links = [
    { to: '/instructions', name: 'Welcome and How to?' },
    { to: '/course-material', name: 'Course Material' },
    { to: '/secchi-sim', name: 'SecchiSim' },
    { to: '/messages', name: 'Messages' },
    { to: '/resources', name: 'Resources' },
    { to: '/trainings', name: 'Upcoming Trainings' },
    { to: '/quizes', name: 'Quiz' }
  ];

  return (
    <div>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="text">Water Quality Monitoring Dashboard</div>
        <div className="text" style={{ marginBottom: '20px' }}>Lake Stewards of Maine</div>
        <nav className="drawer-items">
          {links.map((link) => (
            <div key={link.to}>
              <Link
                to={link.to}
                className={`drawer-item ${activeLink === link.name ? 'active' : ''}`}
                onClick={() => handleLinkClick(link.name)}
              >
                {link.name}
              </Link>
              {link.name === 'Course Material' && isCourseMaterialOpen && (
                <div className="subsections">
                  <Link to="/module1" className="subsection-link">
                    <div className="subsection-item">
                      <h4>Module 1: Introduction</h4>
                    </div>
                  </Link>
                  <Link to="/module2" className="subsection-link">
                    <div className="subsection-item">
                      <h4>Module 2: Advanced Topics</h4>
                    </div>
                  </Link>
                  <Link to="/module3" className="subsection-link">
                    <div className="subsection-item">
                      <h4>Module 3: Final Review</h4>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Hamburger Menu Icon */}
      <button
        className="hamburger"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}
