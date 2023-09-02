import React, { useContext, useEffect, useState } from "react";
import logo from "../../Assets/Images/logo.png";
import { useNavigate } from "react-router-dom";
import { navConfig } from "./NavbarSetting";
const Navbar = () => {
  const navigate = useNavigate();
  const [navHeaders, setHeaders] = useState(null);
  const type = sessionStorage.getItem("userType");
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  useEffect(() => {
    setHeaders(navConfig[type]);
  }, [type]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };
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
                <i style={{ marginLeft: "5px" }} class="bi bi-house"></i>
              </button>
              {navHeaders?.map((navItem) => (
                <button
                  data-bs-toggle="collapse"
                  data-bs-target=".navbar-collapse.show"
                  class=" btn btn-link text-decoration-none"
                  onClick={() => navigate(navItem.link)}
                >
                  {navItem.title}
                  <i style={{ marginLeft: "5px" }} class={navItem?.class}></i>
                </button>
              ))}

              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/contactus")}
              >
                CONTACT
                <i
                  style={{ marginLeft: "5px" }}
                  class="bi bi-person-bounding-box"
                ></i>
              </button>
              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/about")}
              >
                ABOUT US
                <i
                  style={{ marginLeft: "5px" }}
                  class="bi bi-person-lines-fill"
                ></i>
              </button>
              {!isLoggedIn && (
                <button
                  data-bs-toggle="collapse"
                  data-bs-target=".navbar-collapse.show"
                  class=" btn btn-link text-decoration-none"
                  onClick={() => navigate("/login")}
                >
                  LOGIN
                  <i
                    style={{ marginLeft: "5px" }}
                    class="bi bi-box-arrow-in-left"
                  ></i>
                </button>
              )}
              {isLoggedIn && (
                <button
                  data-bs-toggle="collapse"
                  data-bs-target=".navbar-collapse.show"
                  class=" btn btn-link text-decoration-none"
                  onClick={() => logout()}
                >
                  LOGOUT
                  <i
                    style={{ marginLeft: "5px" }}
                    class="bi bi-box-arrow-in-left"
                  ></i>
                </button>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
