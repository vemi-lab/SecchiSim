import React, { useState, useRef } from 'react';
import SecchiSimulator from './ComponentsOfSim/SecchiSimulator';
import Controls from './ComponentsOfSim/Controls';
import './SecchiSimScreen.css';

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
      <h1>Secchi Disk Simulator</h1>
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
