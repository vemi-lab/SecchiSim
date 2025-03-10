import React, { useState, useRef } from 'react';
import SecchiSimulator from './ComponentsOfSim/Clear';
import Controls from './ComponentsOfSim/Controls';
import './SecchiSimScreen.css';
import avatar from '../../assets/avatar.jpg';

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
        <SecchiSimulator 
          settings={settings} 
          onSettingChange={handleSettingChange}
          ref={simulatorRef}
        />
        <Controls 
          settings={settings} 
          onSettingChange={handleSettingChange}
          onDirectionClick={(direction) => simulatorRef.current?.handleArrowClick(direction)}
        />
      </div>
    </div>
  );
};

export default SecchiSimScreen; 
