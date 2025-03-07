import React, { useEffect, useState } from "react";
import { fetchExcelSheet, fetchAllUsers } from "../../Apis/adminDashboard";
import OrderTable from "./OrderTable";
import NotFoundOrder from "../NotFoundOrder";
const Order = () => {
  const type = sessionStorage.getItem("userType");
  const [userType, setUserType] = useState("");
  const [excelSheetInfo, setExcelSheetInfo] = useState(null);
  const [selectedUserId, setselectedUserId] = useState(-1);
  const [users, setUsers] = useState(null);
  const [UserInfo, setUserInfo] = useState(null);
  useEffect(() => {
    setUserType(type);
  }, [type]);
  const fetchExcelSheetData = async (event, id) => {

    event.preventDefault();
    setselectedUserId(id);
    const response = await fetchExcelSheet(id);
    setExcelSheetInfo(response.data.message);
  };
  const fetchUserExcelData = async (id) => {
    const response = await fetchExcelSheet(id);
    setExcelSheetInfo(response.data.message);
  };
  useEffect(() => {
    sessionStorage.getItem("userType") === "ADMIN" &&
      fetchAllUsers().then((response) => {
        console.log(response.data);
        if (response?.data?.success) {
          setUserInfo(response?.data?.message);
          setUsers(response?.data?.message);
        }
      });
    sessionStorage.getItem("userType") !== "ADMIN" &&
      fetchUserExcelData(sessionStorage.getItem("id"));
  }, []);

  function filterUser(username) {
    const users = UserInfo;
    const filterUsers = users.filter((user) => {
      let word = user.firstName + user.lastName;
      let email = user.email;
      word = word.toLowerCase();
      return (
        word.includes(username.toLowerCase().trim()) ||
        email.toLowerCase().includes(user)
      );
    });

    setUsers(filterUsers);
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row m-4 shadow-sm bg-white rounded">
        {userType === "ADMIN" && (
          <div className="col-sm-3 mt-2">
            <h4>Users</h4>
            <hr />
            <div className="shadow-sm bg-white p-2">
              <form>
                <input
                  onChange={(event) => filterUser(event.target.value)}
                  placeholder="Search user"
                  list="userlist"
                  class="form-control"
                  required
                />
              </form>
            </div>
            <hr />
            <div style={{ maxHeight: "400px", overflow: "auto" }}>
              <ul class="list-group list-group mb-2">
                {users?.map((user, index) => (
                  <div class="col-sm-12 mb-2">
                    <div
                      onClick={(event) => fetchExcelSheetData(event, user?._id)}
                      class="card"
                      style={{
                        cursor: "pointer",
                        backgroundColor: user._id === selectedUserId ? "slateblue" : "white",
                        color:user._id === selectedUserId ? "white" : "black"
                      }}
                    >
                      <div class="card-content">
                        <div class="card-body">
                          <div class="media d-flex">
                            <div class="align-self-center">
                              <i class="icon-user success font-large-1 float-right"></i>
                            </div>
                            <div class="media-body text-right">
                              <h5>{user?.firstName + " " + user?.lastName}</h5>
                              <span>{user?.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        )}
        {excelSheetInfo && excelSheetInfo?.length > 0 ? (
          <div
            className={
              userType === "ADMIN"
                ? "col-sm-9 shadow-sm bg-white "
                : "col-sm-12 shadow-sm bg-white "
            }
          >
            {" "}
            <div
              style={{ maxHeight: "100vh", overflowY: "scroll" }}
              className="row"
            >
              <div class="accordion" id="accordionExample">
                {excelSheetInfo?.map((excelSheet, index) => (
                  <div key={index} class="accordion-item m-2">
                    <h2 class="accordion-header" id={`heading${index + 1}`}>
                      <button
                        class={`accordion-button ${
                          index === 0 ? "" : "collapsed"
                        }`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${index + 1}`}
                        aria-expanded={index === 0 ? "true" : "false"}
                        aria-controls={`#collapse${index + 1}`}
                        style={{
                          backgroundColor: "slateblue",
                          color: "white",
                          fontWeight: "500",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {excelSheet.name ?? "FARE"}  {new Date(excelSheet.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                      </button>
                    </h2>
                    <div
                      id={`collapse${index + 1}`}
                      class={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <OrderTable excelRef={excelSheet?._id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              userType === "ADMIN"
                ? "col-sm-9 shadow-sm bg-white "
                : "col-sm-12 shadow-sm bg-white "
            }
          >
            <NotFoundOrder />
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
