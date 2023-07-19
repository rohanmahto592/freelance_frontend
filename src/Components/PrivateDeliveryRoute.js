import React from "react";
import { Navigate } from "react-router-dom";

const PrivateDeliveryRoute = ({ children }) => {
  const authenticated = sessionStorage.getItem("isAuthenticated");
  const isDelivery = sessionStorage.getItem("userType") === "DELIVERY";
  return authenticated && isDelivery ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateDeliveryRoute;
