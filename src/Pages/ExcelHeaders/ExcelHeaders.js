import React, { useEffect, useRef, useState } from "react";
import {
  addEventHeader,
  deleteExcelHeader,
  fetchEventHeaders,
} from "../../Apis/adminDashboard";
import Toast from "../../Components/Toast";
import { exportToExcel } from "../../Utils/jsonToExcelDownload";
const ExcelHeaders = () => {
  const [availableHeaders, setAvailableHeaders] = useState([]);
  const [newHeader, setNewHeader] = useState({
    name: null,
    orderType: "FARE",
  });
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [orderType, setOrderType] = useState('FARE');
  const [isHeaderAdded, setHeaderAdded] = useState(false);
  useEffect(() => {
    fetchHeaders(orderType ? orderType : "FARE");
  }, [isHeaderAdded, orderType]);

  const fetchHeaders = async (orderType) => {
    const response = await fetchEventHeaders(orderType);
    localStorage.setItem(orderType, JSON.stringify(response.data.message));
    if (response?.data?.success) {
      setAvailableHeaders(response.data.message);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setNewHeader({ ...newHeader, [name]: value });
  };

  const deleteHeader = async (event, id) => {
    event.preventDefault();
    const response = await deleteExcelHeader(id);
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
  const checkIfExcelHeaderExist = (newHeader) => {
    const exsistingHeaders = JSON.parse(
      localStorage.getItem(newHeader.orderType)
    );
    return exsistingHeaders?.some((item) => item.name === newHeader.name.toLowerCase().trim());
  };

  const addNewHeader = async (event) => {
    event.preventDefault();
    
   if(checkIfExcelHeaderExist(newHeader))
   {
      setApiError(
        `${newHeader.name} is already present in ${newHeader.orderType}`
      );
      setShowToast(true);
      setIsError(true);

      return;
    
      }
    if (newHeader?.name) {
      const response = await addEventHeader(newHeader);
      if (response.data.success) {
        setHeaderAdded(true);
      }
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    }
  };

  const switchTab = async (event, orderType) => {
    event.preventDefault();
    await fetchHeaders(orderType);
    setOrderType(orderType);
  };

  const downloadHeaders = (event) => {
    event.preventDefault();
    exportToExcel(availableHeaders, `${orderType}Headers.xlsx`);
  };

  return (
    <div>
      <form className="form-style">
        <div className="container ">
          <div className="row">
            <div className="col-sm-6 my-2 ">
              <label className="form-label">Enter Header</label>
              <input
                className="form-control"
                type="text"
                name="name"
                value={newHeader?.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-sm-6 my-2 ">
              <label className="form-label">Select Order Type</label>
              <select
                class="form-select"
                aria-label="Default select example"
                name="orderType"
                onChange={handleInputChange}
                value={newHeader.orderType}
              >
                <option selected value="FARE">
                  FARE
                </option>
                <option value="DPM">DPM</option>
                <option value="ADMIT/DEPOSIT">ADMIT/DEPOSIT</option>
              </select>
            </div>
            <div className="col-sm-12 my-2">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={addNewHeader}
              >
                Add Excel Header
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 my-2">
              <label className="form-label">Listed Headers : </label>
              <ul class="nav nav-tabs mb-3" id="ex2" role="tablist">
                <li class="nav-item" role="presentation">
                  <div
                    class="nav-link active"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-selected="true"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => switchTab(event, "FARE")}
                  >
                    FARE
                  </div>
                </li>
                <li class="nav-item" role="presentation">
                  <div
                    class="nav-link"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-selected="true"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => switchTab(event, "DPM")}
                  >
                    DPM
                  </div>
                </li>
                <li class="nav-item" role="presentation">
                  <div
                    class="nav-link"
                    data-bs-toggle="tab"
                    role="tab"
                    aria-selected="true"
                    style={{ cursor: "pointer" }}
                    onClick={(event) => switchTab(event, "ADMIT/DEPOSIT")}
                  >
                    ADMIT/DEPOSIT
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
                  <button
                    style={{ float: "right" }}
                    className="btn btn-outline-success m-1"
                    onClick={(event) => downloadHeaders(event)}
                  >
                    Download
                  </button>
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Event Header</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableHeaders.map((header, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{header?.name}</td>
                            <td>
                              <button
                                className="btn btn-outline-danger"
                                onClick={(event) =>
                                  deleteHeader(event, header?._id)
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

export default ExcelHeaders;
