import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomDrawer.css';
import logo from '../assets/avatar.jpg';
import quizData from '../data/quizData.json'; // Import module data

export default function CustomDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isCourseMaterialOpen, setIsCourseMaterialOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    if (linkName === 'Course Material') {
      setIsCourseMaterialOpen(!isCourseMaterialOpen);
    } else {
      setIsCourseMaterialOpen(false);
    }
  };

  const links = [
    { to: '/instructions', name: 'Welcome and How to?' },
    { to: '/course-material', name: 'Course Material' },
    { to: '/secchi-sim', name: 'SecchiSim' },
    { to: '/messages', name: 'Messages' },
    { to: '/resources', name: 'Resources' },
    { to: '/trainings', name: 'Upcoming Trainings' },
    { to: '/video', name: 'Video' },
  ];

  return (
    <div>
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>

        {/* Logo */}
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="text">Water Quality Monitoring Dashboard</div>
        <div className="text" style={{ marginBottom: '20px' }}>
          Lake Stewards of Maine
        </div>

        {/* Sidebar Links */}
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

              {/* Dynamically Render Module Subsections */}
              {link.name === 'Course Material' && isCourseMaterialOpen && (
                <div className="subsections">
                  {quizData.map((module) => {
                    const modulePath = `/module/${String(module.id)}`;
                    return (
                      <Link key={module.id} to={modulePath} className='subsection-item'>
                        <div >
                          <h4>{module.title}</h4>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

      </div>

      {/* Hamburger Menu Icon */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Main Content */}
      <div className={`main-content ${isOpen ? 'shifted' : ''}`}></div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
}

