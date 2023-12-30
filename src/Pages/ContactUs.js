import React, { useState } from "react";
import { contactUs } from "../Apis/contact";
import Toast from "../Components/Toast";
import loginImage from "../Assets/Images/contactUs.png";
import { validateEmail } from "../Utils/emailValidator";
export const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isError, setIsError] = useState(true);
  const [isEmailValid, setEmailValid] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailValid) {
      setApiError("Email validation failed,please revalidate it.");
      setIsError(true);
      setShowToast(true);
      return;
    }
    const response = await contactUs(contactInfo);
    if (response.data.success) {
      setApiError("Information Save, We will contact you ASAP");
      setContactInfo({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsError(false);
      setShowToast(true);
    } else {
      setApiError(response.data.message);
      setIsError(true);
      setShowToast(true);
    }
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailValid(false);
      } else {
        setEmailValid(true);
      }
    }
    setContactInfo({ ...contactInfo, [name]: value });
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
          <div class="form-style">
            <form onSubmit={handleSubmit}>
              <div class="row  mb-2">
                <div class="col-md-6">
                  <div class="md-form mb-0">
                    <label for="name" class="">
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="form-control"
                      required
                      value={contactInfo.name}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="md-form mb-0">
                    <label for="email" class="">
                      Your email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      class="form-control"
                      required
                      value={contactInfo.email}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>

              <div class="row  mb-2">
                <div class="col-md-12">
                  <div class="md-form mb-0">
                    <label for="subject" class="">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      class="form-control"
                      required
                      value={contactInfo.subject}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>

              <div class="row  mb-2">
                <div class="col-md-12">
                  <div class="md-form">
                    <label for="message">Your message</label>
                    <textarea
                      required
                      type="text"
                      id="message"
                      name="message"
                      rows="6"
                      class="form-control md-textarea "
                      value={contactInfo.message}
                      onChange={handleOnChange}
                    ></textarea>
                  </div>
                </div>
                <div className="col-sm-12 my-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Send <span class="bi bi-send"></span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
  );
};
