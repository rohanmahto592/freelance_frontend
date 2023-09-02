import React, { useState } from "react";
import { contactUs } from "../Apis/contact";
import Toast from "../Components/Toast";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactInfo.name || !contactInfo.email || !contactInfo.subject) {
      return;
    }

    const response = await contactUs(contactInfo);

    if (response.success) {
      setApiError("Information Save, We will contact you ASAP");
      setShowToast(true);
    } else {
      setApiError(response.message);
      setIsError(true);
      setShowToast(true);
    }
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setContactInfo({ ...contactInfo, [name]: value });
  };

  return (
    <div className="container">
      <section
        style={{
          padding: 0,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h2 class="h1-responsive font-weight-bold text-center my-4">
          Contact Us
        </h2>

        <div class="row shadow p-3 mb-5 bg-whitesmoke rounded">
          <div class="col-sm-12 mb-md-0 mb-5">
            <form
              id="contact-form"
              name="contact-form"
              action="mail.php"
              method="POST"
            >
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
              </div>
            </form>

            <div class="text-center text-md-left">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
            <div class="status"></div>
          </div>
        </div>
      </section>
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
