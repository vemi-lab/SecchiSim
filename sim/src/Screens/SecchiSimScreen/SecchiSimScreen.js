import React, { useState, useRef } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import SecchiSimulator from './ComponentsOfSim/Clear';
import Controls from './ComponentsOfSim/Controls';
import Instructions from './ComponentsOfSim/Instructions';
import Tutorial from './ComponentsOfSim/Tutorial';
import './SecchiSimScreen.css';
import avatar from '../../assets/avatar.jpg';
import Clear from './ComponentsOfSim/Clear';
import Intermediate from './ComponentsOfSim/Intermediate';

const SecchiSimScreen = () => {
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

  return (
    <div className="secchi-sim-screen">
      <img src={avatar} alt="Logo" className="sim-logo" />
      <h1 className='headline'>Secchi Disk Simulator</h1>
      <div className="simulator-container">
        <Routes>
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/clear" element={<Clear />} />
          <Route path="/intermediate" element={<Intermediate />} />
          <Route path="/controls" element={
            <Controls 
              settings={settings} 
              onSettingChange={handleSettingChange}
              onDirectionClick={(direction) => simulatorRef.current?.handleArrowClick(direction)}
            />
          } />
          <Route path="/" element={<Instructions />} />
        </Routes>
      </div>
    </div>
  );
};

export default SecchiSimScreen; 
