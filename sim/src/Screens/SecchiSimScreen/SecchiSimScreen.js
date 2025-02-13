import React, { useState } from 'react';
import SecchiSimulator from './ComponentsOfSim/SecchiSimulator';
import Controls from './ComponentsOfSim/Controls';
import './SecchiSimScreen.css';

const SecchiSimScreen = () => {
  const [settings, setSettings] = useState({
    depth: 0,
    turbidity: 1,
  });

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
        />
        <Controls 
          settings={settings} 
          onSettingChange={handleSettingChange} 
        />
      </div>
    </div>
  );
};

export default SecchiSimScreen; 
