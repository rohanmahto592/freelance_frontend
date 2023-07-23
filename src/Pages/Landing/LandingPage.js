import React, { useEffect, useState } from "react";
import landingimage1 from "../../Assets/Images/plant.png";
import "../../css/LandingPage.css";
import { serviceInfo, servicesProvider } from "../../constants";
import instagram from "../../Assets/Images/instagram.png";
import facebook from "../../Assets/Images/facebook.png";
import twitter from "../../Assets/Images/twitter.png";
import { createFeedback, getAllFeedbacks } from "../../Apis/feedback";
import Toast from "../../Components/Toast";
import "./landingPage.css";
import CardSlider from "../../Components/CardSlider/CardSlider";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    title: "",
    image: null,
    description: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setFeedbackData({ ...feedbackData, [name]: event.target.files[0] });
    } else {
      setFeedbackData({ ...feedbackData, [name]: value });
    }
  };

  const getFeedbacks = async () => {
    const response = await getAllFeedbacks();
    if (!response?.data?.success) {
      setIsError(true);
      setApiError(response.message);
      setShowToast(true);
    } else if (!response?.data?.feedbacks) {
      setApiError(response.data.message);
      setShowToast(true);
    } else {
      setFeedbacks(response.data.feedbacks);
      console.log(feedbacks);
    }
  };

  const sendFeedback = async (event) => {
    event.preventDefault();
    console.log("here");
    const form = new FormData();
    form.append("file", feedbackData.image);
    form.append("feedback", JSON.stringify(feedbackData));
    const response = await createFeedback(form);
    if (!response.data.success) {
      setIsError(true);
      setApiError(response.data.message);
      setShowToast(true);
    } else {
      setIsError(false);
      setApiError(response.data.message);
      setShowToast(true);
    }
    setFeedbackData({
      name: "",
      title: "",
      image: null,
      description: "",
    });
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  return (
    <>
      <div className="container">
        <div class="row">
          <div class="col-md-6 order-md-2 ">
            <img src={landingimage1} alt="landingPage1" class="img-fluid " />
          </div>
          <div class="col-md-6 order-md-1">
            <div className="heading-div">
              <p class=" heading-text fs-1">Your Preferred</p>
              <p class="heading-text fs-1">Service Provider.</p>
            </div>
            <div className="paragraph-div">
              <p class="paragraph-text">
                For organizations seeking superior solutions for all your
                promotional needs.
              </p>
            </div>

            <div class="row">
              <div class="heading-button">
                <button
                  style={{
                    backgroundColor: "#000A99",
                    padding: "1vh 3vh",
                    margin: "2vh",
                  }}
                  class="btn btn-primary"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row m-2">
          <div className="col-sm-12">
            <p style={{ textAlign: "center" }} className="heading2-text fs-1">
              Why Choose Us?
            </p>
          </div>
        </div>
        <div className="row">
          {serviceInfo.map((item) => (
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div
                style={{
                  width: "13%",
                  height: "18%",
                  position: "relative",
                  marginBottom: "-4vh",
                }}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={item.img}
                  alt="service"
                />
              </div>
              <div
                style={{ background: "#F2F2F3" }}
                className="col-sm-12 m-3 p-4 rounded shadow-sm"
              >
                <h4
                  style={{ fontFamily: "comic sans ms", textAlign: "center" }}
                >
                  {item.title}
                </h4>
                <p style={{ textAlign: "center" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="row m-2">
          <div className="col-sm-12">
            <p style={{ textAlign: "center" }} className="heading2-text fs-1">
              At Your Service
            </p>
          </div>
        </div>
        <div className="row">
          {servicesProvider.map((item) => (
            <div className="col-sm-12 col-md-6 col-lg-4 h-100">
              <div
                style={{
                  width: "13%",
                  height: "18%",
                  position: "relative",
                  marginBottom: "-5vh",
                  marginLeft: "45%",
                }}
              >
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={item.img}
                  alt="service"
                />
              </div>
              <div
                style={{ background: "#F2F2F3" }}
                className="col-sm-12 m-3 p-4 rounded shadow-sm"
              >
                <h4
                  style={{ fontFamily: "comic sans ms", textAlign: "center" }}
                >
                  {item.title}
                </h4>
                <p style={{ textAlign: "center" }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {feedbacks && feedbacks.length > 0 && (
        <div style={{ width: "90%", margin: "auto", padding: "12px 0px" }}>
          <p style={{ textAlign: "center" }} className="heading-text fs-1">
            What others are saying about glimpse
          </p>
        </div>
      )}
      {/* carasol */}
      <div className="container">
      <div class="row justify-content-center">
    <div class="col-lg-10 col-md-12">
    {feedbacks && feedbacks.length > 0 && <CardSlider slides={feedbacks} />}
      </div> 
      </div>
      </div>
      <div style={{ width: "90%", margin: "auto", padding: "12px 0px" }}>
        <p style={{ textAlign: "center" }} className="heading-text fs-1">
          Write us a Feedback
        </p>
      </div>
      <form className="form-style">
        <div className="container ">
          <div className="row">
            <div className="col-sm-6 my-2 ">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                placeholder="enter your name"
                required
                type="text"
                name="name"
                value={feedbackData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-sm-6 my-2 ">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                placeholder="Enter title"
                required
                type="text"
                name="title"
                value={feedbackData.title}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 my-2">
              <label className="form-label">Image</label>
              <div class="input-group">
                <input
                  type="file"
                  class="form-control"
                  id="inputGroupFile02"
                  accept=".jpeg, .png, .jpg"
                  name="image"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 my-2">
              <label className="form-label">Feedback</label>
              <textarea
                className="form-control"
                placeholder="Enter your feedback"
                required
                value={feedbackData.description}
                name="description"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 my-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={sendFeedback}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
      <div
        className="footer w-100 mt-4"
        style={{
          // maxHeight: "24vw",
          backgroundColor: "#000A99",
          padding: "10px 0px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "white",
            flexDirection: "column",
          }}
        >
          <div className="row">
            <div className="col-12">Follow us</div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <span>
                <img
                  style={{ width: "30px", height: "30px", margin: "10px" }}
                  src={instagram}
                  alt="instagram"
                />
              </span>
              <span>
                <img
                  style={{ width: "30px", height: "30px", margin: "10px" }}
                  src={facebook}
                  alt="facebook"
                />
              </span>
              <span>
                <img
                  style={{ width: "30px", height: "30px", margin: "10px" }}
                  src={twitter}
                  alt="twitter"
                />
              </span>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <span className="m-3">
                <button
                  class=" btn btn-outline-secondary"
                  onClick={() => navigate("/login")}
                >
                  LOGIN
                </button>
              </span>
              <span className="m-3">
                <button
                  class=" btn btn-outline-secondary "
                  onClick={() => navigate("/signup")}
                >
                  SIGN UP
                </button>
              </span>
            </div>
          </div>
          <div className="row mt-2">
            <div style={{display:'flex',flexWrap:'wrap'}} className="col-sm-12 justify-content-center">
              <span className="m-2">About Us</span>
              <span className="m-2">Contact us</span>
              <span className="m-2">Privacy Policy</span>
              <span className="m-2">Terms and Conditions</span>
              <span className="m-2">FAQ</span>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">© 2021 All Rights Reserved</div>
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
    </>
  );
};

export default LandingPage;
