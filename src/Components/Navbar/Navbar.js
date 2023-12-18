import React, { useEffect, useState } from "react";
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
      <nav className="navbar navbar-expand-lg bg-light navbar-light no-gutters shadow-sm ">
        <div class="container-fluid">
          <div
            style={{ width: "150px", height: "80px" }}
            onClick={() => navigate("/")}
          >
            <img width={"100%"} height={"100%"} src={logo} alt="logo" />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul style={{ fontFamily: "monospace" }} class="navbar-nav ms-auto">
              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class="btn btn-link text-decoration-none"
                onClick={() => navigate("/")}
              >
                Home
                
              </button>
              {navHeaders?.map((navItem) => (
                <button
                  data-bs-toggle="collapse"
                  data-bs-target=".navbar-collapse.show"
                  class=" btn btn-link text-decoration-none"
                  onClick={() => navigate(navItem.link)}
                >
                  {navItem.title}
                 
                </button>
              ))}

              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/contactus")}
              >
                Contact
               
              </button>

              <button
                data-bs-toggle="collapse"
                data-bs-target=".navbar-collapse.show"
                class=" btn btn-link text-decoration-none"
                onClick={() => navigate("/about")}
              >
                AboutUs
               
              </button>
              {!isLoggedIn && (
                <>
                  <button
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    class=" btn btn-link text-decoration-none"
                    onClick={() => navigate("/login")}
                  >
                    Login
                   
                  </button>
                  <button
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    class=" btn btn-link text-decoration-none"
                    onClick={() => navigate("/signup")}
                  >
                    Register
                   
                  </button>
                </>
              )}
              {isLoggedIn && (
                <>
                  <button
                    data-bs-toggle="collapse"
                    data-bs-target=".navbar-collapse.show"
                    class=" btn btn-link text-decoration-none"
                    onClick={() => logout()}
                  >
                    Logout
                    
                  </button>
                  
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
