import React, { useState } from "react";
import signUpIcon from "../Assets/Images/iconsignup.png";
import { validatePassword } from "../Utils/passwordHelper";
import { signup } from "../Apis/auth";
import { useNavigate } from "react-router-dom";
import Toast from "../Components/Toast";
import signUpImage from "../Assets/Images/userCred.png";
const SignUpPage = () => {
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [showToast, setToast] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "SELF",
    universityName: "",
    password: "",
  });

  const navigate = useNavigate();

  const setShowToast = () => {
    setToast(!showToast);
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    if (formData.userType === "UNIVERSITY" && !formData.universityName) {
      return;
    }

    const response = await signup(formData);

    if (response.data.success) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        userType: "",
        universityName: "",
        password: "",
      });
      navigate("/login");
    } else {
      setApiError(response.data.message);
      setShowToast();
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (name === "password") {
      setPasswordError(validatePassword(value));
    }
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div class="container">
      <div class="row m-5 no-gutters shadow-sm">
        <div class="col-md-6 d-none d-md-block">
          <img
            src={signUpImage}
            class="img-fluid"
            style={{ minHeight: "100%" }}
            alt="signup"
          />
        </div>
        <div class="col-md-6 bg-white p-5">
          <h3 style={{ textAlign: "center", color: "#000A99" }} class="pb-3">
            Create Your Account
          </h3>
          <div class="form-style">
            <form onSubmit={handleSignup}>
              <div className="row">
                <div className="col-sm-6 my-2">
                  <label for="firstName" class="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    class="form-control"
                    aria-labelledby="First Name"
                    required="true"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-sm-6 my-2">
                  <label for="lastName" class="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    class="form-control"
                    aria-labelledby="Last Name"
                    required="true"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 my-2">
                  <label for="type" class="form-label">
                    Type
                  </label>
                  <div class="dropdown">
                    <select
                      class="form-select"
                      aria-label="Select user type"
                      value={formData.userType}
                      name="userType"
                      onChange={handleInputChange}
                    >
                      <option disabled>Select user type</option>
                      <option selected value="SELF">
                        SELF
                      </option>
                      <option value="UNIVERSITY">UNIVERSITY</option>
                      <option value="GENERIC">GENERIC</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-6 my-2">
                  <label for="university" class="form-label">
                    University
                  </label>
                  <div class="dropdown">
                    <select
                      class="form-select"
                      aria-label="Select your university"
                      name="universityName"
                      value={formData.universityName}
                      onChange={handleInputChange}
                      required={formData.userType === "UNIVERSITY"}
                    >
                      <option value={null}>Select your university</option>
                      <option value="apple">Apple</option>
                      <option value="banana">Banana</option>
                      <option value="orange">Orange</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-6 my-2">
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
                <div className="col-sm-6 my-2">
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
                  {passwordError && (
                    <div class="alert alert-danger mt-2 p-2" role="alert">
                      {passwordError}
                    </div>
                  )}
                </div>
              </div>
              <div className="row my-2">
                <div style={{ margin: "auto" }} className="col-sm-6 ">
                  <input
                    style={{ background: "#000A99" }}
                    className="form-control btn btn-primary"
                    type="submit"
                  />
                </div>
              </div>
            </form>
            <div class="pt-4 text-center">
              Already have an account?{" "}
              <a style={{ color: "#000A99" }} href="/login">
                Login
              </a>
            </div>
            {showToast && (
              <Toast
                message={apiError}
                setShowToast={setShowToast}
                timer={2000}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
