import React, { useState } from "react";
import { sendForgotPasswordLink, resetPassword } from "../Apis/contact";
import Toast from "../Components/Toast";
import { useNavigate } from "react-router-dom";
import { validatePassword } from "../Utils/passwordHelper";
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState(null);
  const [password, setPassword] = useState(null);
  const [apiError, setApiError] = useState("");
  const [showToast, setToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const[isVisible,setVisible]=useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const isOtpSend =
    JSON.parse(sessionStorage.getItem("resetInfo"))?.success || false;
  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    const response = await sendForgotPasswordLink(email);
    if (response?.data.success) {
      sessionStorage.setItem("resetInfo", JSON.stringify(response.data));
      setEmail(null);
      setApiError(response.data.message);
      setIsError(false);
      setToast(true);
      setTimeout(() => {
       window.location.reload();
      }, 2000);
    }
    else
    {
        setApiError(response.data.message);
      setIsError(true);
      setToast(true);
    }
  };
  const handleResetSubmit = async (event) => {
    event.preventDefault();
    const Email = JSON.parse(sessionStorage.getItem("resetInfo"))?.email || "";
    const token = JSON.parse(sessionStorage.getItem("resetInfo"))?.token || "";
    const response = await resetPassword(Email, otp, password, token);
    if (response.data.success) {
      setApiError(response.data.message);
      setIsError(false);
      setToast(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setApiError(response.data.message);
      setIsError(true);
      setToast(true);
    }
  };
   const SetPassword=(event)=>{
      setPasswordError(validatePassword(event.target.value));
      setPassword(event.target.value)
    }
  
  return (
    <div>
      <div class="container">
        <div class="row m-3 no-gutters shadow-sm ">
          <div class="col-sm-6 mx-auto bg-white p-5">
          <h3 style={{textAlign:'center',color:'#000A99'}}>Forgot Password</h3>
            <div class="form-style">
              <form
                onSubmit={isOtpSend ? handleResetSubmit : handleForgotSubmit}
              >
                <div className="row">
                  {!isOtpSend && (
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
                        onChange={(event) => setEmail(event.target.value)}
                      />
                    </div>
                  )}
                  {isOtpSend && (
                    <div className="col-sm-12 my-2">
                      <label for="email" class="form-label">
                        Enter OTP
                      </label>
                      <input
                        id="otp"
                        name="otp"
                        class="form-control border rounded-pill "
                        aria-labelledby="otp"
                        required="true"
                        placeholder="Enter your OTP"
                        onChange={(event) => setOtp(event.target.value)}
                      />
                      <label for="email" class="form-label">
                        Password
                      </label>
                      <div className="input-group">
                      <input
                       type={isVisible?"text":"password"}
                        id="password"
                        name="password"
                        class="form-control  border rounded-pill "
                        aria-labelledby="new passwoed"
                        required="true"
                        placeholder="Enter new password"
                        onChange={(event)=>SetPassword(event) }
                      />
                      <span class="input-group-append ">
                      <button
                      onClick={()=>setVisible(!isVisible)}
                        style={{marginLeft:'-40px',backgroundColor:'white',color:'teal'}}
                        class="btn btn-secondary border rounded-pill"
                        type="button"
                      >
                       {isVisible?<i class="bi bi-eye-slash-fill"></i>:<i class="bi bi-eye"></i>}
                      </button>
                    </span>
                    </div>
                    {passwordError && (
                    <div class="alert alert-danger mt-2 p-2" role="alert">
                      {passwordError}
                    </div>
                  )}
                    </div>
                  )}
                </div>
                <div className="row my-2">
                  <div style={{ margin: "auto" }} className="col-sm-12 ">
                    <input
                      style={{ background: "#000A99" }}
                      className="form-control btn btn-primary"
                      type="submit"
                      value={isOtpSend ? "Reset Password" : "Send OTP"}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <Toast
          message={apiError}
          setShowToast={setToast}
          timer={3000}
          isError={isError}
        />
      )}
    </div>
  );
};

export default ForgotPasswordPage;
