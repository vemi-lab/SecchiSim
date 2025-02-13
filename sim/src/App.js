import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomDrawer from './components/CustomDrawer'; 
import ModuleScreen from './Screens/ModuleScreen';
import SecchiSimScreen from './Screens/SecchiSimScreen/SecchiSimScreen';
import InstructionsScreen from './Screens/InstructionsScreen';
import MessagesScreen from './Screens/MessagesScreen';
import ResourcesScreen from './Screens/ResourcesScreen';
import TrainingScreen from './Screens/TrainingScreen';
import VideoScreen from './Screens/VideoScreen';
import QuizScreen from './Screens/QuizScreen'

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Drawer takes up fixed space */}
        <CustomDrawer />
        
        {/* Content takes up the rest */}
        <div className="content">
          <Routes>
            <Route path="/video" element={<VideoScreen />} />
            <Route path="/instructions" element={<InstructionsScreen />} />
            <Route path="/course-material" element={<ModuleScreen />} />
            <Route path="/secchi-sim" element={<SecchiSimScreen />} />
            <Route path="/messages" element={<MessagesScreen />} />
            <Route path="/resources" element={<ResourcesScreen />} />
            <Route path="/trainings" element={<TrainingScreen />} />
            <Route path="/quizzes" element={<QuizScreen />} />            
            {/* <Route path="*" element={<InstructionsScreen />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}