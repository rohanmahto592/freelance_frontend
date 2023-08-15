import React, { useState, useEffect, useRef } from "react";
import {
  uploadExcelFile,
  getExcelFile,
  DeleteExcelFile,
  ViewDocFile,
} from "../../Apis/excel";
import {
  viewInitialExcelFile,
  viewProcessedExcelFile,
  ExcelWorkbookSheetCount,
} from "../../Utils/excelFileUploadHelper";
import ProcessingLoader from "../../Components/ProcessingLoader/ProcessingLoader";
import "../../css/ExcelFile.css";
import folder from "../../Assets/Images/folder.png";
import Toast from "../../Components/Toast";
import deleteIcon from "../../Assets/Images/delete.png";
import docIcon from "../../Assets/Images/doc.png";
import { fetchColleges, fetchItems } from "../../Apis/adminDashboard";
const ExcelFileUploadPage = () => {
  const [formData, setFormData] = useState({
    orderType: "ADMIT/DEPOSIT",
    excelfile: null,
    docfile: null,
    university: null,
    items: [],
    currentItemQuantity: 0,
    currentItem: null,
  });
  const [excelFileData, setExcelFileData] = useState(null);
  const [isProcessing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setcurrentData] = useState(null);
  const [totalPages, settotalPages] = useState(0);
  const [perPage, setperPage] = useState(5);
  const [showToast, setShowToast] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isError, setIsError] = useState(true);
  const [items, setItems] = useState([]);
  const [universityItems, setUniversityItems] = useState([]);
  const [receivedCollege, setReceivedCollege] = useState(null);
  const fileInputRef = useRef(null);
  const orderTypeRef=useRef(null);
  function handlePageChange(page, data = excelFileData) {
    setCurrentPage(page);
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const newData = data?.slice(startIndex, endIndex);
    setcurrentData(newData);
  }
  useEffect(() => {
    fetchColleges().then((response) => {
      if (response?.data?.success) {
        console.log(response)
        setReceivedCollege(response.data.message);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    });
  }, []);
  useEffect(() => {
    try {
      getExcelFile().then((response) => {
        if (!response.data.success) {
          setApiError(response.data.message);
          setShowToast(true);
          setProcessing(false);
        } else {
          setExcelFileData(response.data.message);
          handlePageChange(1, response.data.message);
          settotalPages(Math.ceil(response.data.message.length / perPage));
        }
      });
    } catch (err) {
      setApiError("Internal server error,try again after sometime");
      setShowToast(true);
      setProcessing(false);
    }
  }, []);

  const handleRequiredFieldsOnSubmit = () => {
    if (formData.orderType === "ADMIT/DEPOST" || formData.orderType === "DPM") {
      if (!formData.excelfile) {
        setShowToast(true);
        setApiError("Excel file Required");
        return false;
      }
    } else if (formData.orderType === "FARE") {
      if (!formData.university) {
        setShowToast(true);
        setApiError("University is Required in case of FARE");
        return false;
      }
    }
    return true;
  };

  const handleInputChange = async (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    if (value === "FARE") {
      if (items.length === 0) {

        await fetchAllStockItems();
      }
    }

    if (name === "excelFile") {
      const response = await ExcelWorkbookSheetCount(event.target.files[0]);
      if (!response.success) {
        setApiError(response.message);
        setShowToast(true);
        fileInputRef.current.value = "";
      } else {
        setFormData({ ...formData, excelfile: event.target.files[0] });
      }
    } else if (name === "docFile") {
      setFormData({ ...formData, docfile: event.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
      if (name === "university") {
        renderItemsForUniversity(value);
      }
    }
  };

  const handleSubmit = async (event) => {

    event.preventDefault();
    const isRequiredFieldsPresent = handleRequiredFieldsOnSubmit();
    if (!isRequiredFieldsPresent) return;
    const form = new FormData();
    form.append("files", formData.excelfile);
    form.append("files", formData.docfile);
    form.append("orderType", formData.orderType);
    if (formData.orderType === "FARE") {
     
      if(formData.items.length===0)
      {
        return;
      }
      form.append("university", formData.university);
      form.append("items", formData.items);
    }
    setProcessing(true);
    const response = await uploadExcelFile(form);
    if (!response.data.success) {
      setApiError(response.data.message);
      setShowToast(true);
      setProcessing(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setProcessing(false);
      setIsError(false);
    }
  };
  const DeleteExcelFileData = async (id) => {
    const response = await DeleteExcelFile(id);
    if (!response?.data?.success) {
      setApiError(response.message);
      setShowToast(true);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    }
  };

  async function fetchAllStockItems() {
    const response = await fetchItems();
    if (response.data.success) {
      setItems(response.data.message);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  }

  const renderItemsForUniversity = (university) => {
    const uniItems = items.filter((item) => item.university === university);
    setUniversityItems(uniItems);
  };

  const addItem = () => {
    if (!formData.currentItem || !formData.currentItemQuantity) return;

    const isCurrentItemAlreadyPresent = formData.items.filter((item) => {
      const name = item.split("-")[0];
      if (name === formData.currentItem) {
        return true;
      }
      return false;
    });

    const isQuantityAboveStockLimit = universityItems.filter((item) => {
      if (
        item.itemName === formData.currentItem &&
        JSON.parse(item.quantity) < formData.currentItemQuantity
      )
        return true;
      return false;
    });

    if (isQuantityAboveStockLimit && isQuantityAboveStockLimit.length > 0)
      return;

    if (isCurrentItemAlreadyPresent && isCurrentItemAlreadyPresent.length > 0)
      return;

    const newItemsArray = formData.items;
    newItemsArray.push(
      `${formData.currentItem}-${formData.currentItemQuantity}`
    );
    setFormData({ ...formData, items: newItemsArray });
  };

  const removeItem = (selectedItem) => {
    const newItemsArray = formData.items.filter(
      (item) => selectedItem !== item
    );
    setFormData({ ...formData, items: newItemsArray });
  };

  return (
    <main class="d-flex justify-content-center align-items-center m-4  ">
      <div className="container ">
        <form
          className="row border-3 rounded p-4"
          style={{ backgroundColor: "#f2f2f2" }}
          onSubmit={handleSubmit}
        >
          <div className="col-sm-6  mb-4">
            <label className="form-label">Order Type</label>
            <div class="dropdown">
              <select
               ref={orderTypeRef}
                class="form-select"
                aria-label="Select order type"
                value={formData.orderType}
                name="orderType"
                onChange={handleInputChange}
              >
                <option disabled>Select order type</option>
                <option selected value="ADMIT/DEPOSIT">
                  ADMIT/DEPOSIT
                </option>
                <option value="FARE">FARE</option>
                <option value="DPM">DPM</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6">
            <label for="type" class="form-label">
              Choose your excel file
            </label>
            <div className="col-sm-12  mb-4">
              <input
                disabled={formData.orderType === "FARE"}
                ref={fileInputRef}
                type="file"
                aria-label="Browse"
                className="form-control"
                id="inputGroupFile02"
                name="excelFile"
                accept=".xlsx"
                required={formData.orderType !== "FARE"}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <label for="type" class="form-label">
              Upload doc file
            </label>
            <div className="col-sm-12  mb-4">
              <input
                type="file"
                aria-label="Browse"
                className="form-control"
                id="inputGroupFile03"
                name="docFile"
                accept=".doc,.docx,.pdf"
                onChange={handleInputChange}
                disabled={formData.orderType !== "DPM"}
              />
            </div>
          </div>
          <div className="col-sm-6">
            <label for="type" class="form-label">
              Select University
            </label>
            <div class="dropdown mb-4">
              <select
                disabled={formData.orderType !== "FARE"}
                class="form-select"
                aria-label="Select university"
                value={formData.university}
                name="university"
                onChange={handleInputChange}
                required={formData.orderType === "FARE"}
              >
                <option selected>Select University</option>
                {receivedCollege?.map((college, index) => (
                        <option
                          key={index}
                          value={college.Name + ", " + college.Address}
                        >
                          {college.Name + ", " + college.Address}
                        </option>
                      ))}
              </select>
            </div>
          </div>
          {  orderTypeRef?.current?.value==='FARE' && universityItems && universityItems.length > 0 && (
            <>
              <div className="col-sm-4  mt-2 mb-4">
                <label className="form-label">Items</label>
                <div class="dropdown">
                  <select
                    class="form-select"
                    aria-label="Select order type"
                    value={formData.currentItem}
                    name="currentItem"
                    onChange={handleInputChange}
                  >
                    <option disabled selected>
                      Select item
                    </option>
                    {universityItems.map((item) => (
                      <option value={item.itemName}>
                        {item.itemName.toUpperCase()} ({item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-sm-4 mt-2 mb-4">
                <label className="form-label">Quantity</label>
                <input
                  className="form-control"
                  type="number"
                  name="currentItemQuantity"
                  value={formData.currentItemQuantity}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="col-sm-4"
                style={{ marginTop: "auto", marginBottom: "24px" }}
              >
                <input
                  style={{ background: "#000A99" }}
                  className="form-control btn btn-primary"
                  type="button"
                  onClick={addItem}
                  value="Add Item"
                />
              </div>
            </>
          )}
          {  orderTypeRef?.current?.value==='FARE' && formData && formData?.items && formData?.items?.length > 0 && (
            <div className="col-sm-12 mb-4 mt-2 ml-2">
              <div className="row" style={{ marginLeft: "2px" }}>
                {formData.items.map((item) => (
                  <div
                    className="col-sm-2"
                    style={{
                      backgroundColor: "slateblue",
                      borderRadius: "4px",
                      color:'white',
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingRight: "0px",
                      margin: "2px 4px",
                    }}
                  >
                    <span>{item.toUpperCase()}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        backgroundColor: "gray",
                        cursor: "pointer",
                        padding: "0px 4px",
                      }}
                      onClick={() => removeItem(item)}
                    >
                      x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="col-sm-12 ">
            <div className="col-sm-12 ">
              <input
                style={{ background: "#000A99" }}
                className="form-control btn btn-primary"
                type="submit"
                value="Upload"
                disabled={isProcessing}
              />
            </div>
          </div>
        </form>
        {isProcessing && <ProcessingLoader />}

        <div
          style={{ backgroundColor: "#f2f2f2" }}
          className="row mt-3 rounded"
        >
          <div id="table-container" className="col-sm-12 mt-3">
            <table
              style={{
                width: "100%",
                border: "5px solid #f2f2f2",
                borderRadius: "5px",
              }}
              class="table table-bordered border border-3"
            >
              <thead style={{ fontFamily: "monospace" }}>
                <tr>
                  <th rowspan="2">S.No</th>
                  <th rowspan="2">File Name</th>
                  <th rowspan="2">Created At</th>
                  <th colspan="3">Initial File</th>
                  <th colspan="3">Processed File</th>
                  <th rowspan="2">Doc File</th>
                  <th rowSpan="2">Action</th>
                </tr>
                <tr>
                  <th style={{ color: "GrayText" }}>Size</th>
                  <th style={{ color: "GrayText" }}>File Count</th>
                  <th style={{ color: "GrayText" }}>View</th>
                  <th style={{ color: "GrayText" }}>Size</th>
                  <th style={{ color: "GrayText" }}> Dispatched File Count</th>
                  <th style={{ color: "GrayText" }}>View</th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((row, index) => {
                  return (
                    <tr style={{ textAlign: "center" }}>
                      <td>{index + 1}</td>
                      <td>{row.name?row.name:`FARE ${new Date(row.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}`}</td>
                      <td>
                        {new Date(row.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </td>
                      <td>{row.initialFileSize}</td>
                      <td>{row.intialExcelFileCount}</td>
                      <td>
                        <button
                          onClick={() =>
                            viewInitialExcelFile(row.initialExcelFile, row.name?row.name:`FARE ${new Date(row.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}`)
                          }
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "white",
                          }}
                        >
                          <img
                            style={{ height: "2.8vh", width: "2.8vh" }}
                            src={folder}
                            alt="download file"
                          />
                        </button>
                      </td>
                      <td>{row.processedFileSize}</td>
                      <td>{row.processedExcelFileDispatchedCount}</td>
                      <td>
                        <button
                          onClick={() =>
                            viewProcessedExcelFile(
                              row.processedExcelFile,
                              row.name?row.name:`FARE ${new Date(row.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              })}`
                            )
                          }
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "white",
                          }}
                        >
                          <img
                            style={{ height: "2.8vh", width: "2.8vh" }}
                            src={folder}
                            alt="download file"
                          />
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => ViewDocFile(row.docFile)}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "white",
                          }}
                        >
                          <img
                            style={{ height: "2.8vh", width: "2.8vh" }}
                            src={docIcon}
                            alt="delete file"
                          />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => DeleteExcelFileData(row._id)}
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5px",
          }}
        >
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                style={{
                  fontFamily: "comic sans ms",
                  padding: "1px 10px",
                  color: "slateblue",
                  borderRadius: "5px",
                  border: "2px solid slateblue",
                  margin: "5px",
                  backgroundColor: "white",
                }}
                key={page}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            )
          )}
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
    </main>
  );
};

export default ExcelFileUploadPage;
