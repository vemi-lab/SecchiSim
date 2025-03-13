import React, { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Clear from './ComponentsOfSim/Clear';
import Instructions from './ComponentsOfSim/Instructions';
import Tutorial from './ComponentsOfSim/Tutorial';
import Intermediate from './ComponentsOfSim/Intermediate';
import avatar from '../../assets/avatar.jpg';
import './SecchiSimScreen.css';


const SecchiSimScreen = () => {
  const [currentPage, setCurrentPage] = useState('instructions');
  const [settings, setSettings] = useState({
    depth: 0,
    turbidity: 1,
  });

  const simulatorRef = useRef(null);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'clear':
        return <Clear settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />;
      case 'tutorial':
        return <Tutorial />;
      case 'intermediate':
        return <Intermediate />;
      case 'instructions':
      default:
        return <Instructions setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="secchi-sim-screen">
      <img src={avatar} alt="Logo" className="sim-logo" />
      <h1 className='headline'>Secchi Disk Simulator</h1>
      <div className="simulator-container">
        {renderPage()}
      </div>
    </div>
  );
};

export default SecchiSimScreen;