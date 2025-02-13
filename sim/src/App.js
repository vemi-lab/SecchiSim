import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PrivateRoutes from "./PrivateRoutes";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Signup from "./components/Signup"
//import Dashboard from "./components/Dashboard"
import SecchiSimScreen from "./Screens/SecchiSimScreen";
import InstructionsScreen from "./Screens/InstructionsScreen";
import MessagesScreen from "./Screens/MessagesScreen";
import ResourcesScreen from "./Screens/ResourcesScreen";
import TrainingScreen from "./Screens/TrainingScreen";
import Time from "./Screens/time";
import CourseMaterialScreen from "./Screens/CourseMaterialScreen";
import Secchi_1 from "./Screens/SecchiTraining/Secchi_1";
import Secchi_2 from "./Screens/SecchiTraining/Secchi_2";
import Secchi_3 from "./Screens/SecchiTraining/Secchi_3";
import DO_1 from "./Screens/DOTraining/DO_1";
import DO_2 from "./Screens/DOTraining/DO_2";
import DO_3 from "./Screens/DOTraining/DO_3";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect to login if no user is logged in */}
          <Route path="/" element={<AuthRedirect />} />
          
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (after login, user lands here with CustomDrawer) */}
          <Route element={<PrivateRoutes />}>
            <Route path="/instructions" element={<InstructionsScreen />} />
            <Route path="/video" element={<Time />} />
            <Route path="/course-material" element={<CourseMaterialScreen />} />
            <Route path="/secchi_1" element={<Secchi_1 />} />
            <Route path="/secchi_2" element={<Secchi_2 />} />
            <Route path="/secchi_3" element={<Secchi_3 />} />
            <Route path="/do_1" element={<DO_1 />} />
            <Route path="/do_2" element={<DO_2 />} />
            <Route path="/do_3" element={<DO_3 />} />
            <Route path="/secchi-sim" element={<SecchiSimScreen />} />
            <Route path="/messages" element={<MessagesScreen />} />
            <Route path="/resources" element={<ResourcesScreen />} />
            <Route path="/trainings" element={<TrainingScreen />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// This component redirects to login if the user is not authenticated
function AuthRedirect() {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/login" /> : <Navigate to="/instructions" />;
}
