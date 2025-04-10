import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { auth } from "../firebase";
import { FiSettings } from 'react-icons/fi';
import user from '../assets/UserIcon.png';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() =>{
    if (auth.currentUser && !auth.currentUser.emailVerified){
      alert("Please verify your email before accessing the dashboard.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      {/* Header with Settings Icon and Profile */}
      <div className="header">
        <FiSettings className="setting-icon" />
        <div onClick={() => navigate("/profile")} className="profile">
          <img src={user} alt="User Icon" />
        </div>
      </div>

      {/* Main Content */}
      <div className="scroll-view">
        <p>This screen will be the homepage of secchi sim.</p>
      </div>
    </div>
  );
}