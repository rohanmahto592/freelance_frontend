import React from "react";

import "../css/Admin.css";
import Users from "./Admin/Users/Users";
import Stock from "./Admin/Stock/Stock";
import Popup from "./Popups/Popup";
const AdminDashboard = () => {
  return (
    <>
      <div style={{ maxHeight: "100vh" }} className="container ">
        <Popup />
        <Users />
        <Stock />
      </div>
    </>
  );
};

export default AdminDashboard;
