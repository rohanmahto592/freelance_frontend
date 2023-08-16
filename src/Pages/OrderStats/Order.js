import React, { useEffect, useState } from "react";
import { fetchExcelSheet } from "../../Apis/adminDashboard";
import OrderTable from "./OrderTable";
const Order = () => {
  const type = sessionStorage.getItem("userType");
  const [userType, setUserType] = useState("");
  const [excelSheetInfo, setExcelSheetInfo] = useState(null);
  useEffect(() => {
    setUserType(type);
  }, [type]);

  useEffect(() => {
    fetchExcelSheet().then((response) => {
      if (response.data.success) {
        console.log(response.data.message)
        setExcelSheetInfo(response.data.message);
      }
    });
  }, []);

  return (
    <>
      <div className="container mt-5">
        <h4 style={{ textAlign: "center" }}>All Orders</h4>
        <div style={{maxHeight:'100vh',overflowY:'scroll'}} className="row">
          <div class="accordion" id="accordionExample">
            {excelSheetInfo?.map((excelSheet, index) => (
              <div key={index} class="accordion-item m-2">
                <h2 class="accordion-header" id={`heading${index + 1}`}>
                  <button
                    class={`accordion-button ${index===0?'':"collapsed"}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index + 1}`}
                    aria-expanded={index===0?"true":'false'}
                    aria-controls={`#collapse${index + 1}`}
                    style={{backgroundColor:'#EF715F',color:'white',fontWeight:'500',fontFamily:'sans-serif'}}
                  >
                    {excelSheet?.name}
                  </button>
                </h2>
                <div
                  id={`collapse${index + 1}`}
                  class={`accordion-collapse collapse ${index===0?"show":''}`}
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                  <OrderTable excelRef={excelSheet?._id}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
