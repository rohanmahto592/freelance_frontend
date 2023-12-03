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
const Users = () => {
  const [verifiedusers, setVerifiedUsers] = useState(null);
  const [nonverifiedusers, setNonVerifiedUsers] = useState(null);
  const [selectedUserId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("tabs-1");
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeTab === "tabs-1") {
      getUsers("true").then((response) => {
        setVerifiedUsers(response.data.message);
      });
    } else if (activeTab === "tabs-2") {
      getUsers("false").then((response) => {
        setNonVerifiedUsers(response.data.message);
      });
    }
  }, [activeTab]);
  const handleOpenModal = (userId) => {
    setUserId(userId);
    setShowModal(true);
  };

  const handleSelectRow = (event, rowData) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, rowData]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row !== rowData));
    }
  };
  const verifyUser = async () => {
    if (selectedRows.length > 0) {
      const response = await verifyUsers(selectedRows);
      if (response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);
      setTimeout(()=>{
        window.location.reload()
      },1500)
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
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
    <h3 style={{textAlign:'center',margin:'10px'}}>Users</h3>
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
        </ul>
        <div class="tab-content" id="ex1-content">
          <div
            class="tab-pane fade show active"
            id="tabs-1"
            role="tabpanel"
            aria-labelledby="ex1-tab-1"
            style={{maxHeight:'400px',overflowY:'auto'}}
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>User Type</th>
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
            style={{maxHeight:'400px',overflowY:'auto'}}
          >
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Verified</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {nonverifiedusers?.map((user, index) => (
                  <tr key={index}>
                    <td>{user?.firstName}</td>
                    <td>{user?.lastName}</td>
                    <td>{user?.email}</td>
                    <td>{user?.userType}</td>
                    <td>
                      <img
                        style={{ width: "3vh", height: "3vh" }}
                        src={cross}
                        alt="cross"
                      />
                    </td>
                    <th>
                      <input
                        style={{marginLeft:'50%'}}
                        type="checkbox"
                        onChange={(event) => handleSelectRow(event, user._id)}
                      />
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
            {nonverifiedusers && nonverifiedusers.length > 0 && (
              <div className="d-grid gap-2 col-3 mx-auto">
                <button
                  onClick={() => verifyUser()}
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
      <hr/>
    </>
  );
};

export default Users;
