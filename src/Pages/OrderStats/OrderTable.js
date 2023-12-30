import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../Apis/adminDashboard";
import { Dna } from "react-loader-spinner";
const OrderTable = (props) => {
  const { excelRef } = props;
  const [OriginalOrders, setOriginalOrders] = useState(null);
  const [CopyOrders, setCopyOrders] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isInitialData, setInitialData] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetchOrders(excelRef).then((response) => {
      if (response.data.success) {
        setLoading(false);
        setOriginalOrders(response.data.message);
        setInitialData(response.data.isOne);
        setCopyOrders(response.data.message);
      }
    });
  }, [excelRef]);
  useEffect(() => {
    const copyDuplicates = OriginalOrders;
    const filteredData = copyDuplicates?.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setCopyOrders(filteredData);
  }, [searchValue]);

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        <>
          <div style={{ position: "sticky" }} className="col-sm-12 input-group">
            <input
              onChange={(event) => setSearchValue(event.target.value)}
              class="form-control border-end-0 border rounded-pill mt-2 mb-4"
              type="search"
              placeholder="Search..."
            />
            <span class="input-group-append mt-2 mb-4">
              <button
                style={{marginLeft:'-40px'}}
                class="btn btn-secondary border-bottom-0 border rounded-pill"
                type="button"
              >
                <i class="bi bi-search"></i>
              </button>
            </span>
            {/* <input  onChange={(event)=>setSearchValue(event.target.value)} placeholder="Search on the given data" className="form-control mt-2 mb-4"/> */}
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Email</th>
                  <th>Application ID</th>
                  <th>Tracking ID</th>
                  <th>Order Status</th>
                  <th>Order Type</th>
                  <th>CreatedAt</th>
                  <th>UpdatedAt</th>
                </tr>
              </thead>
              <tbody>
                {CopyOrders?.map((item, index) =>
                  !isInitialData ? (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.email}</td>
                      <td>{item?.applicationId}</td>
                      <td>{item?.trackingId}</td>
                      <td>{item?.orderStatus}</td>
                      <td>{item?.orderType}</td>
                      <td>
                        {item.createdAt &&
                          new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                      </td>
                      <td>
                        {item.updatedAt &&
                          new Date(item.updatedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          })}
                      </td>
                    </tr>
                  ) : (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item["email"] || item["Email"]}</td>
                      <td>
                        {item["Application ID"] ||
                          item["application id"] ||
                          item[" application id"] ||
                          item["STUDENT_ID"]}
                      </td>
                      <td>NA</td>
                      <td>Pending</td>
                      <td>
                        {item["Admissions Status"] ||
                          item["orderType"] ||
                          item["admissions status"]}
                      </td>
                      <td>NA</td>
                      <td>NA</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default OrderTable;
