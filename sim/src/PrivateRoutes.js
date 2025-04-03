// src/PrivateRoutes.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CustomDrawer from "./components/CustomDrawer";

const PrivateRoutes = () => {
  const { currentUser, hasAccessToRole } = useAuth();

  // Example: Restrict access to DO-related routes
  const isDOAccessAllowed = hasAccessToRole("Dissolved Oxygen Role");

  return currentUser ? (
    <div className="app-container">
      <CustomDrawer />
      <div className="content">
        <Outlet context={{ isDOAccessAllowed }} /> {/* Pass role access as context */}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
