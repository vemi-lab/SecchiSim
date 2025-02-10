import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomDrawer from './components/CustomDrawer'; 
import ModuleScreen from './Screens/ModuleScreen';
import SecchiSimScreen from './Screens/SecchiSimScreen';
import InstructionsScreen from './Screens/InstructionsScreen';
import MessagesScreen from './Screens/MessagesScreen';
import ResourcesScreen from './Screens/ResourcesScreen';
import TrainingScreen from './Screens/TrainingScreen';
import Time from './Screens/time';
// import QuizScreen from './Screens/QuizScreen';
import CourseMaterialScreen from './Screens/CourseMaterialScreen';

import './App.css'; // Import the CSS file where responsive styles are defined.

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar or Drawer */}
        <CustomDrawer />

        {/* Main Content */}
        <div className="content">
          <Routes>
            <Route path="/video" element={<Time />} />
            <Route path="/instructions" element={<InstructionsScreen />} />
            <Route path="/course-material" element={<CourseMaterialScreen />} />
            <Route path="/secchi-sim" element={<SecchiSimScreen />} />
            <Route path="/messages" element={<MessagesScreen />} />
            <Route path="/resources" element={<ResourcesScreen />} />
            <Route path="/trainings" element={<TrainingScreen />} />
            {/* <Route path="/quizes" element={<QuizScreen />} /> */}
            <Route path="/module/:moduleId" element={<ModuleScreen />} /> 
         </Routes>
        </div>
      </div>
    </Router>
  );
}
