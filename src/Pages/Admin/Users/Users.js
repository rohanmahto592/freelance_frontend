import React, { useState, useEffect, useRef } from "react";
import cross from "../../../Assets/Images/cross.png";
import verified from "../../../Assets/Images/check.png";
import {
  verifyUsers,
  getUsers,
  deleteUsers,
} from "../../../Apis/adminDashboard";
import Toast from "../../../Components/Toast";
import ModalComponent from "../../../Components/Modal/ModalComponent";
import { RotatingLines } from "react-loader-spinner";
const Users = () => {
  const [verifiedusers, setVerifiedUsers] = useState(null);
  const [nonverifiedusers, setNonVerifiedUsers] = useState(null);
  const [selectedUserId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedApprovedRows, setSelectedApprovedRows] = useState([]);
  const [selectedRejectedRows, setSelectedRejectedRows] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("tabs-1");
  const [userDeleted, setUserDeleted] = useState(false);
  const [isdataLoaded, setDataLoaded] = useState(false);
  const [InActiveUsers, setInActiveUsers] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeTab === "tabs-1") {
      setDataLoaded(true);
      getUsers({ isVerified: true, isInactive: false }).then((response) => {
        setDataLoaded(false);
        setVerifiedUsers(response.data.message);
      });
    } else if (activeTab === "tabs-2") {
      setDataLoaded(true);
      getUsers({ isVerified: false, isInactive: false }).then((response) => {
        setDataLoaded(false);
        setNonVerifiedUsers(response.data.message);
      });
    } else if (activeTab === "tabs-3") {
      setDataLoaded(true);
      getUsers({ isVerified: true, isInactive: true }).then((response) => {
        setDataLoaded(false);
        setInActiveUsers(response.data.message);
      });
    }
  }, [activeTab, userDeleted]);
  const handleOpenModal = (userId) => {
    setUserId(userId);
    setShowModal(true);
  };

  const handleApproveRow = (event, rowData) => {
    if (event.target.checked) {
      setSelectedApprovedRows([...selectedApprovedRows, rowData]);
    } else {
      setSelectedApprovedRows(
        selectedApprovedRows.filter((row) => row !== rowData)
      );
    }
  };

  const handleRejectRow = (event, rowData) => {
    if (event.target.checked) {
      setSelectedRejectedRows([...selectedRejectedRows, rowData]);
    } else {
      setSelectedRejectedRows(
        selectedRejectedRows.filter((row) => row !== rowData)
      );
    }
  };
  const handleSubmit = async () => {
    if (selectedApprovedRows.length > 0 || selectedRejectedRows.length > 0) {
      const response = await verifyUsers(
        selectedApprovedRows,
        selectedRejectedRows
      );
      if (response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);
        getUsers("false").then((response) => {
          setDataLoaded(false);
          setNonVerifiedUsers(response.data.message);
        });
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
      setSelectedApprovedRows([]);
      setSelectedRejectedRows([]);
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSaveChanges = async () => {
    try {
      const response = await deleteUsers(selectedUserId);
      if (response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);
        setUserDeleted(!userDeleted);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    } catch (err) {
      console.log(err);
    }
    handleCloseModal();
  };
  const handleTabChange = (event) => {
    setActiveTab(event?.target?.href?.split("#")[1]);
  };
  return (
    <>
      <h3 style={{ textAlign: "center", margin: "10px" }}>Users</h3>
      {isdataLoaded && <RotatingLines width="40" />}
      <div id="table-row" className="row m-3 ">
        <ul
          class="nav nav-tabs mb-3"
          onClick={handleTabChange}
          id="ex1"
          role="tablist"
        >
          <li class="nav-item" role="presentation">
            <a
              class="nav-link active"
              id="tab-1"
              data-bs-toggle="tab"
              href="#tabs-1"
              role="tab"
              aria-controls="tabs-1"
              aria-selected="true"
            >
              Authorized
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="tab-2"
              data-bs-toggle="tab"
              href="#tabs-2"
              role="tab"
              aria-controls="tabs-2"
              aria-selected="false"
            >
              Unauthorized
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              id="tab-3"
              data-bs-toggle="tab"
              href="#tabs-3"
              role="tab"
              aria-controls="tabs-3"
              aria-selected="false"
            >
              Inactive Users
            </a>
          </li>
        </ul>
        <div class="tab-content" id="ex1-content">
          <div
            class="tab-pane fade show active"
            id="tabs-1"
            role="tabpanel"
            aria-labelledby="ex1-tab-1"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>University Name</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {verifiedusers?.map((user, index) => (
                  <tr key={index}>
                    <td>{user?.firstName}</td>
                    <td>{user?.lastName}</td>
                    <td>{user?.email}</td>
                    <td>{user?.userType}</td>
                    <td>{user?.universityName || "NULL"}</td>
                    <td>
                      <img
                        style={{ width: "3vh", height: "3vh" }}
                        src={verified}
                        alt="cross"
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleOpenModal(user?._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            class="tab-pane fade"
            id="tabs-2"
            role="tabpanel"
            aria-labelledby="ex1-tab-2"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>University Name</th>
                  <th>Verified</th>
                  <th>Approve</th>
                  <th>Reject</th>
                </tr>
              </thead>
              <tbody>
                {nonverifiedusers?.map((user, index) => (
                  <tr key={index}>
                    <td>{user?.firstName}</td>
                    <td>{user?.lastName}</td>
                    <td>{user?.email}</td>
                    <td>{user?.userType}</td>
                    <td>{user.universityName || "NULL"}</td>
                    <td>
                      <img
                        style={{ width: "3vh", height: "3vh" }}
                        src={cross}
                        alt="cross"
                      />
                    </td>
                    <th>
                      <input
                        disabled={selectedRejectedRows.includes(user._id)}
                        style={{ marginLeft: "50%" }}
                        type="checkbox"
                        onChange={(event) => handleApproveRow(event, user._id)}
                      />
                    </th>
                    <th>
                      <input
                        disabled={selectedApprovedRows.includes(user._id)}
                        style={{ marginLeft: "50%" }}
                        type="checkbox"
                        onChange={(event) => handleRejectRow(event, user._id)}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
            {nonverifiedusers && nonverifiedusers.length > 0 && (
              <div className="d-grid gap-2 col-3 mx-auto">
                <button
                  onClick={() => handleSubmit()}
                  className="btn btn-outline-primary "
                >
                  Submit
                </button>
              </div>
            )}
          </div>
          <div
            class="tab-pane fade"
            id="tabs-3"
            role="tabpanel"
            aria-labelledby="ex1-tab-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th style={{color:'red'}}>Deleted University Name</th>
                  <th>Verified</th>
                  <th style={{color:'red'}}>isInactive</th>
                </tr>
              </thead>
              <tbody>
                {InActiveUsers?.map((user, index) => (
                  <tr key={index}>
                    <td>{user?.firstName}</td>
                    <td>{user?.lastName}</td>
                    <td >{user?.email}</td>
                    <td>{user?.userType}</td>

                    <td>{user.universityName || "NULL"}</td>
                    <td>
                      <img
                        style={{ width: "3vh", height: "3vh" }}
                        src={verified}
                        alt="cross"
                      />
                    </td>
                    <td style={{fontWeight:'bold'}}>{user.isInactive && "True"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {nonverifiedusers && nonverifiedusers.length > 0 && (
              <div className="d-grid gap-2 col-3 mx-auto">
                <button
                  onClick={() => handleSubmit()}
                  className="btn btn-outline-primary "
                >
                  Submit
                </button>
              </div>
            )}
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
      <ModalComponent
        modalRef={modalRef}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleSaveChanges={handleSaveChanges}
        title="User Action"
        body="Are you really want to delete the user?"
      />
      <hr />
    </>
  );
};

export default Users;
