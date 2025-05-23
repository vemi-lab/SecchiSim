import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Clear from './ComponentsOfSim/Clear';
import Tutorial from './ComponentsOfSim/Tutorial';
import Intermediate from './ComponentsOfSim/Intermediate';
import Productive from './ComponentsOfSim/Productive';
import Dystrophic from './ComponentsOfSim/Dystrophic';
import DystrophicProductive from './ComponentsOfSim/DystrophicProductive';
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
// import avatar from '../../assets/avatar.jpg';
import './SecchiSimScreen.css';

const SecchiSimScreen = () => {
  const [settings, setSettings] = useState({
    depth: 0,
    turbidity: 1,
  });
  const { currentUser } = useAuth();
  const [moduleStatus, setModuleStatus] = useState({
    clear: false,
    intermediate: false,
    productive: false,
    dystrophic: false,
    dystrophicproductive: false
  });

  const simulatorRef = useRef(null);

  useEffect(() => {
    const loadModuleStatus = async () => {
      if (!currentUser) return;

      try {
        const currentYear = new Date().getFullYear().toString();
        const quizDocRef = doc(db, `users/${currentUser.email}/${currentYear}/Quizzes`);
        const quizDoc = await getDoc(quizDocRef);

        if (quizDoc.exists()) {
          const data = quizDoc.data();
          setModuleStatus(prev => ({
            ...prev,
            clear: data.Clear_Disabled || false,
            intermediate: data.Intermediate_Disabled || false,
            productive: data.Productive_Disabled || false,
            dystrophic: data.Dystrophic_Disabled || false,
            dystrophicproductive: data.DystrophicProductive_Disabled || false
          }));
        }
      } catch (error) {
        console.error("Error loading module status:", error);
      }
    };

    loadModuleStatus();
  }, [currentUser]);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getCompletionStatus = (moduleType) => {
    if (!currentUser) return "Please Login";
    return moduleStatus[moduleType] ? "Complete" : "Incomplete";
  };

  return (
    <div className="secchi-sim-screen">
      <div className="simulator-container">
        <Routes>
          <Route path="/" element={
            <div>
              <h1>Instructions</h1>
              <h2>
                Volunteers need to take only one qualifying reading for re-certification.
                Please select a lake type that is most similar to the lake that you monitor.
                (If you are not sure what lake is closest to the one you monitor please select the Clear Lake)
              </h2>
              <h3>Before you start, read the tutorial</h3>
              <Link to="tutorial">
                <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Tutorial</button>
              </Link>
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Lake Type</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Description</th>
                    <th style={{ border: '1px solid #ccc', padding: '10px' }}>Completion Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Link to="clear">
                        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Clear</button>
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      Bluish color, with readings deeper than 4 meters
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: moduleStatus.clear ? 'green' : 'inherit' }}>
                      {getCompletionStatus('clear')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Link to="intermediate">
                        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Intermediate</button>
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      Blue or green-brown, with readings between 4 and 7 meters
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: moduleStatus.intermediate ? 'green' : 'inherit' }}>
                      {getCompletionStatus('intermediate')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Link to="productive">
                        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Productive</button>
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      Green Background, high algae content, readings shallower than 3 meters
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: moduleStatus.productive ? 'green' : 'inherit' }}>
                      {getCompletionStatus('productive')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Link to="dystrophic">
                        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Dystrophic</button>
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      Distinct tea or rootbeer color, readings shallower than 3 meters
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: moduleStatus.dystrophic ? 'green' : 'inherit' }}>
                      {getCompletionStatus('dystrophic')}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      <Link to="dystrophicproductive">
                        <button style={{ padding: '10px 20px', cursor: 'pointer' }}>Dystrophic Productive</button>
                      </Link>
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                      Green-brown and murky, readings shallower than 3 meters
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '10px', color: moduleStatus.dystrophicproductive ? 'green' : 'inherit' }}>
                      {getCompletionStatus('dystrophicproductive')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          } />
          <Route path="clear" element={<Clear settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />} />
          <Route path="tutorial" element={<Tutorial ref={simulatorRef} />} />
          <Route path="intermediate" element={<Intermediate settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />} />
          <Route path="productive" element={<Productive settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />} />
          <Route path="dystrophic" element={<Dystrophic settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />} />
          <Route path="dystrophicproductive" element={<DystrophicProductive settings={settings} onSettingChange={handleSettingChange} ref={simulatorRef} />} />
        </Routes>
      </div>
    </div>
  );
};

export default SecchiSimScreen;