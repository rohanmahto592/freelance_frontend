import React, { useEffect, useState } from "react";
import {
  fetchUserEmails,
  addUserEmail,
  deleteUserEmail,
} from "../Apis/adminDashboard";
import Toast from "./Toast";
import { validateEmail } from "../Utils/emailValidator";
const CustomizeEmail = () => {
  const [Emails, setEmails] = useState([]);
  const [userEmailDetails, setUserEmailDetails] = useState({
    email: null,
    userType: "Admin",
    name:null,
  });
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userType, setuserType] = useState(null);
  const [EmailAdded, setEmailAdded] = useState(false);
  useEffect(() => {
    fetchUserEmails(userType ? userType : "Admin").then((response) => {
      if (response.data.success) {
        setEmails([...response.data.message]);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    });
  }, [EmailAdded, userType]);

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserEmailDetails({ ...userEmailDetails, [name]: value });
  };

  const deleteEmail = async (event, id) => {
    event.preventDefault();
    const response = await deleteUserEmail(id);
    if (response.data.success) {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  };
  const checkIfEmailExist = (userEmailDetails) => {
    return Emails?.some(
      (item) =>
        (item.email + item.userType).toLowerCase().trim() ===
        (userEmailDetails.email + userEmailDetails.userType)
          .toLowerCase()
          .trim()
    );
  };

  const switchTab = async (event, userType) => {
    event.preventDefault();
    setuserType(userType);
  };
  const AddUserEmail = async (event) => {
    event.preventDefault();
    if (!validateEmail(userEmailDetails?.email)) {
        setApiError("Not a valid Email");
        setShowToast(true);
        setIsError(true);
        return;
    }
    if (checkIfEmailExist(userEmailDetails)) {
      setApiError("Email with user type already exist");
      setShowToast(true);
      setIsError(true);
      return;
    }
    const response = await addUserEmail(userEmailDetails);
    if (response.data.success) {
      setEmailAdded(true);
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  };
  return (
    <div>
      <form className="form-style" onSubmit={AddUserEmail}>
        <div className="container ">
          <div className="row">
          <div className="col-sm-12">
            <div className="row">
            <div className="col-sm-6 ">
              <label className="form-label">Enter Email</label>
              <input
                required
                className="form-control"
                type="text"
                name="email"
                value={userEmailDetails?.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label">Enter Name</label>
              <input
                required
                className="form-control"
                type="text"
                name="name"
                value={userEmailDetails?.name}
                onChange={handleInputChange}
              />
            </div>
            </div>
            </div>
            <div className="col-sm-12 my-2 ">
              <label className="form-label">Select User Type</label>
              <select
                class="form-select"
                aria-label="Default select example"
                name="userType"
                required
                onChange={handleInputChange}
                value={userEmailDetails.userType}
              >
                <option selected value="Admin">
                  Admin
                </option>
                <option value="Delivery">Delivery</option>
              </select>
            </div>
            <div className="col-sm-12 my-2">
              <button type="submit" className="btn btn-primary w-100">
                Add Email
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 my-2">
              <label className="form-label">
                Listed Emails Based On userType :{" "}
              </label>
              <ul class="nav nav-tabs mb-3" id="ex2" role="tablist">
                <li class="nav-item" role="presentation">
                  <div
                    class="nav-link active"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-selected="true"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => switchTab(event, "Admin")}
                  >
                    Admin
                  </div>
                </li>
                <li class="nav-item" role="presentation">
                  <div
                    class="nav-link"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-selected="true"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => switchTab(event, "Delivery")}
                  >
                    Delivery
                  </div>
                </li>
              </ul>
              <div className="col-sm-12 my-2 ">
                <div
                  class="tab-pane fade show active"
                  id="fare-tab"
                  role="tabpanel"
                  aria-labelledby="fare-tab"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Emails?.map((info, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{info?.email}</td>
                            <td>{info?.name}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger"
                                onClick={(event) =>
                                  deleteEmail(event, info?._id)
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
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

export default CustomizeEmail;
