// src/PrivateRoutes.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CustomDrawer from "./components/CustomDrawer";

const PrivateRoutes = () => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <div className="app-container">
      <CustomDrawer />
      <div className="content">
        <Outlet /> {/* This is where the protected pages will render */}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoutes;
