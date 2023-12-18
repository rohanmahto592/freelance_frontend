import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Apis/auth";
import Toast from "../Components/Toast";
import loginImage from "../Assets/Images/userCred.png";
import { redirection } from "../constants";
import "../css/LandingPage.css";
const LoginPage = () => {
  const [apiError, setApiError] = useState("");
  const [showToast, setToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoginProgress, setLoginProgress] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    const loginData = localStorage.getItem("loginFormData");
    if (loginData) {
      setFormData(JSON.parse(loginData));
    }
  }, []);

  const setShowToast = () => {
    setToast(!showToast);
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginProgress(true);
    const response = await login(formData);
    if (response.data.success) {
      setLoginProgress(false);
      setFormData({
        email: "",
        password: "",
      });
      const token = response.headers.authorization.split(" ")[1];
      const userType = response.data.userType;
      sessionStorage.setItem("isAuthenticated", true);
      sessionStorage.setItem("userType", userType);
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("id", response.data.id);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("universityName", response.data.universityName);
      sessionStorage.setItem(
        "userName",
        response.data.firstName + " " + response.data.lastName
      );
      response?.data?.userId &&
        sessionStorage.setItem("userDeliveryId", response.data.userId);
      const redirect = redirection[userType];
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
      localStorage.removeItem("loginFormData");
      setTimeout(() => {
        navigate(redirect);
      }, 1500);
    } else {
      setLoginProgress(false);
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };
      localStorage.setItem("loginFormData", JSON.stringify(updatedFormData));
      return updatedFormData; // Return the updated state
    });
  };
  return (
    <div class="container">
      <div class="row m-3  no-gutters shadow-sm ">
        <div class="col-md-6 d-none d-md-block">
          <img
            src={loginImage}
            class="img-fluid"
            style={{ minHeight: "100%" }}
            alt="signup"
          />
        </div>
        <div class="col-md-6 bg-white p-5">
          <h3 style={{ textAlign: "center", color: "#000A99" }} class="pb-3">
            Login
          </h3>
          <div class="form-style">
            <form onSubmit={handleLogin}>
              <div className="row">
                <div className="col-sm-12 my-2">
                  <label for="email" class="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    class="form-control"
                    aria-labelledby="email"
                    required="true"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-12 my-2">
                  <label for="password" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="form-control"
                    aria-labelledby="passwoord"
                    required="true"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row my-2">
                <div style={{ margin: "auto" }} className="col-sm-12 ">
                  {!isLoginProgress ? (
                    <input
                      style={{ background: "#000A99" }}
                      className="form-control btn btn-primary"
                      type="submit"
                      value="Login"
                    />
                  ) : (
                    <button  style={{ background: "#000A99",width:'100%' }} class=" form-control btn btn-primary" type="button" disabled>
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging...
                    </button>
                  )}
                </div>
              </div>
            </form>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              class="pt-4 text-center "
              onClick={() => navigate("/signup")}
            >
              <p
                style={{
                  marginBottom: "0px",
                  fontFamily: "sans-serif",
                  letterSpacing: "1px",
                }}
              >
                Get Members Benefit.{" "}
              </p>
              <button
                style={{ background: "#000A99" }}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
            {showToast && (
              <Toast
                message={apiError}
                setShowToast={setShowToast}
                timer={2000}
                isError={isError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
