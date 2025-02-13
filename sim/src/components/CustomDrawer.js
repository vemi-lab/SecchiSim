import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/avatar.jpg';

export default function CustomDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [isCourseMaterialOpen, setIsCourseMaterialOpen] = useState(false);
  const [isSecchiOpen, setIsSecchiOpen] = useState(false);
  const [isDissolvedoxygenOpen, setIsDissolvedoxygenOpen] = useState(false);

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

  const toggleSubsection = (subsection) => {
    if (subsection === 'Secchi') {
      setIsSecchiOpen(!isSecchiOpen);
    } else if (subsection === 'Dissolved Oxygen') {
      setIsDissolvedoxygenOpen(!isDissolvedoxygenOpen);
    }
  };

  const links = [
    { to: '/instructions', name: 'Welcome and How to?' },
    { to: '/course-material', name: 'Course Material', hasSubsections: true },
    { to: '/trainings', name: 'Upcoming Trainings' },
    { to: '/video', name: 'Video' },
    { to: '/dashboard', name: 'Dashboard' },
  ];
  //maybe delete dashboard

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

              {/* Course Material Subsections */}
              {link.name === 'Course Material' && isCourseMaterialOpen && (
                <div className="subsections">
                  {/* Secchi Subsection */}
                  <div className="subsection-header" onClick={() => toggleSubsection('Secchi')}>
                    <h4>Secchi</h4>
                  </div>
                  {isSecchiOpen && (
                    <div className="subsections">
                      <Link key="secchi_1" to="/secchi_1" className='subsection-item'>
                        <div>
                          <h4>Secchi 1</h4>
                        </div>
                      </Link>
                      <Link key="secchi_2" to="/secchi_2" className='subsection-item'>
                        <div>
                          <h4>Secchi 2</h4>
                        </div>
                      </Link>
                      <Link key="secchi_3" to="/secchi_3" className='subsection-item'>
                        <div>
                          <h4>Secchi 3</h4>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Dissolved Oxygen Subsection */}
                  <div className="subsection-header" onClick={() => toggleSubsection('Dissolved Oxygen')}>
                    <h4>Dissolved Oxygen</h4>
                  </div>
                  {isDissolvedoxygenOpen && (
                    <div className="subsections">
                      <Link key="do_1" to="/do_1" className='subsection-item'>
                        <div>
                          <h4>DO 1</h4>
                        </div>
                      </Link>
                      <Link key="do_2" to="/do_2" className='subsection-item'>
                        <div>
                          <h4>DO 2</h4>
                        </div>
                      </Link>
                      <Link key="do_3" to="/do_3" className='subsection-item'>
                        <div>
                          <h4>DO 3</h4>
                        </div>
                      </Link>
                    </div>
                  )}
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
