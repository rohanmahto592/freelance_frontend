import React from "react";
import logo from "../../Assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-light navbar-light no-gutters shadow-sm ">
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
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div
            class="navbar-collapse  collapse"
            id="navbarSupportedContent"
            role="navigation"
          >
            <ul style={{ fontFamily: "monospace" }} class="navbar-nav ms-auto">
              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class="btn btn-link text-decoration-none"
                onClick={() => navigate("/")}
              >
                HOME
              </button>

              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/admin/dashboard")}
              >
                DASHBOARD
              </button>
              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
              >
                CONTACT
              </button>
              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/login")}
              >
                LOGIN
              </button>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
