import React, { useEffect, useState } from "react";
import landingimage1 from "../../Assets/Images/plant.png";
import "../../css/LandingPage.css";
import { serviceInfo, servicesProvider } from "../../constants";
import instagram from "../../Assets/Images/instagram.png";
import facebook from "../../Assets/Images/facebook.png";
import twitter from "../../Assets/Images/twitter.png";
import { createFeedback, getAllFeedbacks } from "../../Apis/feedback";
import "./landingPage.css";
import CardSlider from "../../Components/CardSlider/CardSlider";
import { Link, useNavigate } from "react-router-dom";

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
    }
  };

  const sendFeedback = async (event) => {
    event.preventDefault();
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
  const logout=()=>{
    sessionStorage.clear();
    navigate("/login")
  }
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
                  onClick={() => navigate("/about")}
                >
                  Know More
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
            {feedbacks && feedbacks.length > 0 && (
              <CardSlider slides={feedbacks} />
            )}
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
      <footer
        className="footer w-100 mt-4"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%230099ff' fill-opacity='1' d='M0,224L18.5,186.7C36.9,149,74,75,111,80C147.7,85,185,171,222,197.3C258.5,224,295,192,332,197.3C369.2,203,406,245,443,234.7C480,224,517,160,554,128C590.8,96,628,96,665,101.3C701.5,107,738,117,775,106.7C812.3,96,849,64,886,90.7C923.1,117,960,203,997,202.7C1033.8,203,1071,117,1108,112C1144.6,107,1182,181,1218,176C1255.4,171,1292,85,1329,80C1366.2,75,1403,149,1422,186.7L1440,224L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
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
            <div
              style={{
                color: "gray",
                fontWeight: "bold",
                fontFamily: "sans-serif",
              }}
              className="col-12"
            >
              Follow us
            </div>
          </div>
          <div className="row mt-2">
            <div style={{ cursor: "pointer" }} className="col-12">
              <span>
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    margin: "10px",
                    border: "3px solid teal",
                    borderRadius: "50%",
                    borderStyle: "dotted",
                  }}
                  src={instagram}
                  alt="instagram"
                />
              </span>
              <span>
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    margin: "10px",
                    border: "3px solid teal",
                    borderRadius: "50%",
                    borderStyle: "dotted",
                  }}
                  src={facebook}
                  alt="facebook"
                />
              </span>
              <span>
                <img
                  style={{
                    width: "30px",
                    height: "30px",
                    margin: "10px",
                    border: "3px solid teal",
                    borderRadius: "50%",
                    borderStyle: "dotted",
                  }}
                  src={twitter}
                  alt="twitter"
                />
              </span>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <span className="m-3">
                {" "}
                {sessionStorage.getItem("isLoggedIn")=='true' ? (
                  <button
                    class=" btn btn-secondary"
                    onClick={logout}
                  >
                    LOGOUT
                  </button>
                ) : (
                  <button
                    class=" btn btn-secondary"
                    onClick={() => navigate("/login")}
                  >
                    LOGIN
                  </button>
                )}
              </span>

             { !sessionStorage.getItem("isLoggedIn") && <span className="m-3">
                <button
                  class=" btn btn-secondary "
                  onClick={() => navigate("/signup")}
                >
                  SIGN UP
                </button>
              </span>}
            </div>
          </div>
          <div className="row mt-2">
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
              className="col-sm-12 justify-content-center"
            >
              <Link style={{ textDecoration: "none" }} to="/about">
                <span
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    fontFamily: "sans-serif",
                  }}
                  className="m-2"
                >
                  About Us
                </span>
              </Link>
              <Link style={{ textDecoration: "none" }} to="/contactus">
                <span
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    fontFamily: "sans-serif",
                  }}
                  className="m-2"
                >
                  Contact Us
                </span>
              </Link>
              {/* <span className="m-2">Privacy Policy</span>
              <span className="m-2">Terms and Conditions</span>
              <span className="m-2">FAQ</span> */}
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">© 2023 All Rights Reserved</div>
          </div>
        </div>
      </footer>
      {/* {showToast && (
        <Toast
          message={apiError}
          setShowToast={setShowToast}
          timer={2000}
          isError={isError}
        />
      )} */}
    </>
  );
};

export default LandingPage;
