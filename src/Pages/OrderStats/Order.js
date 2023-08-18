import React, { useEffect, useState } from "react";
import { fetchExcelSheet, fetchAllUsers } from "../../Apis/adminDashboard";
import OrderTable from "./OrderTable";
import NotFoundOrder from "../NotFoundOrder";
const Order = () => {
  const type = sessionStorage.getItem("userType");
  const [userType, setUserType] = useState("");
  const [excelSheetInfo, setExcelSheetInfo] = useState(null);
  const [userId, setuserId] = useState(0);
  const [users, setUsers] = useState(null);
  useEffect(() => {
    setUserType(type);
  }, [type]);
  const fetchExcelSheetData = async(event) => {
    event.preventDefault();
    console.log(userId);
    let Id=userId.split("  ")[1];
    Id=Id.replace(/[()]/g, '');
   const response= await  fetchExcelSheet(Id);
      setExcelSheetInfo(response.data.message);

  };
  const fetchUserExcelData=async(id)=>{
    const response= await  fetchExcelSheet(id);
    setExcelSheetInfo(response.data.message);
  }
  useEffect(() => {
    sessionStorage.getItem("userType") === "ADMIN" &&
      fetchAllUsers().then((response) => {
        if (response?.data?.success) {
          setUsers(response?.data?.message);
        }
      });
    sessionStorage.getItem("userType")!=='ADMIN' && fetchUserExcelData(sessionStorage.getItem("id"));
  }, []);

  return (
    <>
      <div className="container mt-5">
        {userType === "ADMIN" ? (
          <h4 style={{ textAlign: "center" }}>All Orders</h4>
        ) : (
          <h4 style={{ textAlign: "center" }}>My Orders</h4>
        )}
        {userType === "ADMIN" && (
         
          <form onSubmit={fetchExcelSheetData}>
             
            <div className="row m-4">
              <div className="col-sm-10 mt-2">
                <input placeholder="Search order status by userId or username" onChange={(event)=>setuserId(event.target.value)} list="userlist" class="form-control" required />
               <datalist id="userlist">
                {users?.map((user,index)=>(
                  <option key={index} value={user.firstName+" "+user.lastName+"  ("+user._id+")"}/>
                ))}
               </datalist>
              </div>
              <div className="col-sm-2 mt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                 <i class="bi bi-search"></i>

                </button>
              </div>
            </div>
          </form>
        )}
       {excelSheetInfo && excelSheetInfo?.length>0?<div
          style={{ maxHeight: "100vh", overflowY: "scroll" }}
          className="row"
        >
          <div class="accordion" id="accordionExample">
            {excelSheetInfo?.map((excelSheet, index) => (
              <div key={index} class="accordion-item m-2">
                <h2 class="accordion-header" id={`heading${index + 1}`}>
                  <button
                    class={`accordion-button ${index === 0 ? "" : "collapsed"}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index + 1}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`#collapse${index + 1}`}
                    style={{
                      backgroundColor: "#EF715F",
                      color: "white",
                      fontWeight: "500",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {excelSheet?.name}
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
        </div>:<NotFoundOrder/>}
      </div>
    </>
  );
};

export default Order;
