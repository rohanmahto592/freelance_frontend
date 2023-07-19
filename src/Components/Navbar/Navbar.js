import React from "react";
import logo from "../../Assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light no-gutters shadow-sm ">
        <div class="container-fluid">
          <div
            style={{ width: "150px", height: "80px" }}
            onClick={() => navigate("/")}
          >
            <img width={"100%"} height={"100%"} src={logo} alt="logo" />
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse " id="navbarText" role="navigation">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item p-1 " onClick={() => navigate("/")}>
               
                  HOME
              </li>
               
              <li
                class="nav-item p-1 "
                onClick={() => navigate("/admin/dashboard")}
              >
                DASHBOARD
              </li>
              <li class="nav-item p-1 ">
                
                  ABOUT US
                
              </li>
              <li class="nav-item p-1 ">
                
                  CONTACT
               
              </li>
              <li class="nav-item p-1 " onClick={()=>navigate('/login')}>
                
                  LOGIN
               
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
