
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdminRoute = ({children}) => {
    const authenticated = sessionStorage.getItem("isAuthenticated");
  const isAdmin = sessionStorage.getItem("userType") === "ADMIN";
  return authenticated && isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}

export default PrivateAdminRoute;
