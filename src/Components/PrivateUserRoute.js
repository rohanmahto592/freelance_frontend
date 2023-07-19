import React from "react";
import { Navigate } from "react-router-dom";
import { userTypes } from "../constants";
const PrivateUserRoute = ({ children }) => {
  const authenticated = sessionStorage.getItem("isAuthenticated");
  const user=sessionStorage.getItem('userType');
  return authenticated &&( userTypes.indexOf(user) !== -1) ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateUserRoute;
