import React, { useState, useEffect, useRef } from "react";
import {
  uploadExcelFile,
  getExcelFile,
  DeleteExcelFile,
  ViewDocFile,
  fetchFile,
} from "../../Apis/excel";
import {
  viewInitialExcelFile,
  viewProcessedExcelFile,
  ExcelWorkbookSheetCount,
} from "../../Utils/excelFileUploadHelper";
import ProcessingLoader from "../../Components/ProcessingLoader/ProcessingLoader";
import "../../css/ExcelFile.css";
import Toast from "../../Components/Toast";
import { fetchColleges, fetchItems } from "../../Apis/adminDashboard";
import EditItemModalComponent from "../../Components/Modal/EditItemModalComponent";
import admitDepositFileDummy from '../../SampleExcelFiles/Admit-Deposit Dummy ExcelSheet.xlsx'
import DPMdummy from '../../SampleExcelFiles/DPM Dummy ExcelSheet.xlsx'
const ExcelFileUploadPage = () => {
  const [formData, setFormData] = useState({
    orderType: "ADMIT/DEPOSIT",
    excelfile: null,
    docfile: null,
    university: null,
    currentItemQuantity: 0,
    currentItem: null,
    currentItemId: null,
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
  const orderTypeRef = useRef(null);
  const [itemsWithUniversity, setItemWithUniversity] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const itemModalRef = useRef(null);
  const [component, setComponent] = useState(null);
  function checkIsUniversity(university) {
    let universityName = sessionStorage.getItem("universityName");
    const response = university.filter((name) => {
      const Name = name.Name + ", " + name.Address;
      if (Name === universityName) {
        return name;
      }
    });
    return response;
  }
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
        if (sessionStorage.getItem("userType") === "UNIVERSITY") {
          setReceivedCollege(checkIsUniversity(response.data.message));
        } else {
          setReceivedCollege(response.data.message);
        }
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
    } else if (name === "currentItem") {
      const itemName = value.split("$")[1];
      const itemId = value.split("$")[0];
      setFormData({
        ...formData,
        currentItem: itemName,
        currentItemId: itemId,
      });
    } else if (name === "university") {
      setFormData({
        ...formData,
        university: value,
      });
      renderItemsForUniversity(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const createExcelHeaderComponent = (Headers, orderType) => {
    return (
      <table style={{ width: "100%" }}>
        <tr>
          <th
            style={{
              padding: "5px",
              border: "2px solid #dddddd",
              textAlign: "center",
            }}
          >
            S.NO
          </th>
          <th
            style={{
              padding: "5px",
              border: "2px solid #dddddd",
              textAlign: "center",
            }}
          >
            Title
          </th>
        </tr>
        {Headers.map((item, index) => (
          <tr key={index}>
            <td
              style={{
                padding: "5px",
                border: "2px solid #dddddd",
                textAlign: "center",
              }}
            >
              {index + 1}
            </td>
            <td
              style={{
                padding: "5px",
                border: "2px solid #dddddd",
                textAlign: "center",
              }}
            >
              {item.name}
            </td>
          </tr>
        ))}
      </table>
    );
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
      if (Object.keys(itemsWithUniversity).length === 0) {
        return;
      }
      form.append("items", JSON.stringify(itemsWithUniversity));
    } else if (formData.orderType === "DPM") {
      form.append("university", formData.university);
    }
    setProcessing(true);
    const response = await uploadExcelFile(form);
    if (!response.data.success) {
      setApiError(response.data.message);
      setShowToast(true);
      setProcessing(false);
      setIsError(true);
      if (response.data.headerInvalid) {
        setShowModal(true);
        setComponent(
          createExcelHeaderComponent(
            response.data.Headers,
            response.data.orderType
          )
        );
        setModalTitle(
          <div
            style={{ fontSize: "15px", letterSpacing: "1px" }}
            class="alert alert-danger"
            role="alert"
          >
            Required Headers are not present for {response.data.orderType},check
            from the given list.
          </div>
        );
      }
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setProcessing(false);
      setIsError(false);
      window.location.reload();
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

    const currentItemWithUni = itemsWithUniversity[formData.university];
    if (currentItemWithUni) {
      const isCurrentItemAlreadyPresent = currentItemWithUni.filter((item) => {
        let name = item.split("-")[0];
        name = name.split("$")[1];
        if (name === formData.currentItem) {
          return true;
        }
        return false;
      });

      if (isCurrentItemAlreadyPresent && isCurrentItemAlreadyPresent.length > 0)
        return;
    }

    const newItemsArray = currentItemWithUni || [];

    newItemsArray.push(
      `${formData.currentItemId}$${formData.currentItem}-${formData.currentItemQuantity}`
    );

    setItemWithUniversity({
      ...itemsWithUniversity,
      [formData.university]: newItemsArray,
    });
  };

  const removeItem = (selectedItem, selectedUni) => {
    let newItemsArray = itemsWithUniversity[selectedUni].filter(
      (item) => selectedItem !== item
    );
    if (newItemsArray.length === 0) {
      const newItemsWithUniversity = itemsWithUniversity;
      delete newItemsWithUniversity[selectedUni];
      setItemWithUniversity({
        ...itemsWithUniversity,
      });
      return;
    }
    setItemWithUniversity({
      ...itemsWithUniversity,
      [formData.university]: newItemsArray,
    });
  };
  const closeModal = () => {
    setShowModal(false);
    setModalTitle(null);
  };
  const fetchFileData = async (excelId, type) => {
    const response = await fetchFile({ _id: excelId, type: type });
    if (response.data.success) {
      const row = response.data.message[0];
      if (type === "docFile") {
        ViewDocFile(row.docFile);
      } else if (type === "initialExcelFile") {
        viewInitialExcelFile(
          row?.initialExcelFile,
          row.name
            ? row.name
            : `FARE ${new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}`
        );
      } else {
        viewProcessedExcelFile(
          row.processedExcelFile,
          row.name
            ? row.name
            : `FARE ${new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}`
        );
      }
    }
  };
  return (
    <>
    <div className="d-flex justify-content-center align-items-center m-4 flex-wrap">
    <a href={admitDepositFileDummy} class="btn btn-link">Admit/Deposit Template ExcelSheet <i style={{paddingLeft:'5px',color:'orange'}} class="bi bi-download"></i></a>
    <a href={DPMdummy} class="btn btn-link"> DirectPrintMail Template ExcelSheet <i style={{paddingLeft:'5px',color:'orange'}} class="bi bi-download"></i></a>
    </div>
    <main class="d-flex justify-content-center align-items-center m-4 ">
      <div className="container ">

        <form
          className="row border border-1 rounded p-4"
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
            <div
              style={{ paddingLeft: "0px", paddingRight: "0px" }}
              className="col-sm-12  mb-4"
            >
              <input
                type="file"
                aria-label="Browse"
                className="form-control"
                id="inputGroupFile03"
                name="docFile"
                accept=".doc,.docx"
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
                disabled={formData.orderType === "ADMIT/DEPOSIT"}
                class="form-select"
                aria-label="Select university"
                value={
                  formData.orderType === "ADMIT/DEPOSIT"
                    ? ""
                    : formData.university
                }
                name="university"
                onChange={handleInputChange}
                required={
                  formData.orderType === "FARE" || formData.orderType === "DPM"
                }
              >
                <option disabled={formData.orderType === "FARE" || formData.orderType === "DPM"?true:false}>Please select university</option>
                {receivedCollege?.map((college, index) => (
                  <option
                    selected={index===0}
                    key={index}
                    value={college.Name + ", " + college.Address}
                  >
                    {college.Name + ", " + college.Address}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {orderTypeRef?.current?.value === "FARE" &&
            formData.university &&
            formData.university.length > 0 &&
            universityItems &&
            universityItems.length === 0 && (
              <div class="col-sm-12">
                <div class=" col-sm-12">
                  <div class="alert alert-danger" role="alert">
                    No Item is present in the bucket for the selected
                    university.
                  </div>
                </div>
              </div>
            )}
          {orderTypeRef?.current?.value === "FARE" &&
            universityItems &&
            universityItems.length > 0 && (
              <>
                <div className="col-sm-4  mt-2 mb-4">
                  <label className="form-label">Items</label>
                  <div class="dropdown">
                    <select
                      class="form-select"
                      aria-label="Select order type"
                      value={
                        formData.currentItem && formData.currentItemId
                          ? `${formData.currentItemId}$${formData.currentItem}`
                          : null
                      }
                      name="currentItem"
                      onChange={handleInputChange}
                    >
                      <option selected>Select item</option>
                      {universityItems?.map((item, index) => (
                        <option
                          key={index}
                          value={`${item._id}$${item.itemName}`}
                        >
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
                    className="form-control btn btn-primary"
                    type="button"
                    onClick={addItem}
                    value="Add Item"
                  />
                </div>
              </>
            )}
          {orderTypeRef?.current?.value === "FARE" &&
            universityItems &&
            universityItems.length > 0 && (
              <div className="col-sm-12 mb-4 mt-2 ml-2">
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
                      <th>College</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(itemsWithUniversity).map((uni) => (
                      <tr>
                        <td className="col-sm-4">{uni}</td>
                        {itemsWithUniversity[uni].map((item, index) => (
                          <td
                            key={index}
                            className="col-sm-2"
                            style={{
                              borderRadius: "4px",
                              display: "inline-block",
                              paddingRight: "0px",
                              margin: "2px 4px",
                            }}
                          >
                            <span>{item.split("$")[1].toUpperCase()}</span>
                            <span
                              style={{
                                float: "right",
                                color: "slateblue",
                                borderLeft: "1px solid black",
                                cursor: "pointer",
                                padding: "0px 6px",
                                fontWeight: "bold",
                              }}
                              onClick={() => removeItem(item, uni)}
                            >
                              x
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          <div className="col-sm-12 d-flex justify-content-center">
            <div className="col-sm-12 ">
              <input
                className="form-control btn btn-primary"
                type="submit"
                value="Upload"
                disabled={isProcessing}
              />
            </div>
          </div>
        </form>
        {isProcessing && <ProcessingLoader />}

        <div className="row mt-3 rounded">
          <div id="table-container" className="col-sm-12 mt-3">
            <table
              style={{
                width: "100%",
                fontFamily: "sans-serif",
                letterSpacing: "1px",
                borderRadius: "5px",
              }}
              class="table table-bordered table-striped border border-1 rounded"
            >
              <thead>
                <tr>
                  <th
                    style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    rowspan="2"
                  >
                    S.No
                  </th>
                  <th
                    style={{ backgroundColor: "#5B7CFD ", color: "#E9F8FD" }}
                    rowspan="2"
                  >
                    File Name
                  </th>
                  <th
                    style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    rowspan="2"
                  >
                    Created At
                  </th>
                  <th
                    style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    colspan="3"
                  >
                    Initial File
                  </th>
                  <th
                    style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    colspan="5"
                  >
                    Processed File
                  </th>
                  <th
                    style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    rowspan="2"
                  >
                    Doc File
                  </th>
                  {/* <th rowSpan="2">Action</th> */}
                </tr>
                <tr>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    Size
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    File Count
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    View
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    Size
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    {" "}
                    Dispatched Count
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    {" "}
                    ShipRocket_Delivery Count
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    {" "}
                    IndianPost_Delivery Count
                  </th>
                  <th style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}>
                    View
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData?.map((row, index) => {
                  return (
                    <tr key={index} style={{ textAlign: "center" }}>
                      <td>{index + 1}</td>
                      <td>
                        {row.name
                          ? row.name
                          : `FARE ${new Date(row.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}`}
                      </td>
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
                            fetchFileData(row._id, "initialExcelFile")
                          }
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "#E9F8FD",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="25"
                            height="25"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#FFA000"
                              d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
                            ></path>
                            <path
                              fill="#FFCA28"
                              d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
                            ></path>
                          </svg>
                        </button>
                      </td>
                      <td>{row.processedFileSize}</td>
                      <td>{row.processedExcelFileDispatchedCount}</td>
                      <td>{row.processedExcelFileShipRocketDeliveryCount}</td>
                      <td>{row.processedExcelFileIndianPostDeliveryCount}</td>
                      <td>
                        <button
                          onClick={() =>
                            fetchFileData(row._id, "processedExcelFile")
                          }
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "#E9F8FD",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="25"
                            height="25"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#FFA000"
                              d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
                            ></path>
                            <path
                              fill="#FFCA28"
                              d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
                            ></path>
                          </svg>
                        </button>
                      </td>
                      <td>
                        {row.isDocPresent && (
                          <button
                            onClick={() => fetchFileData(row._id, "docFile")}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "#E9F8FD",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="25"
                              height="25"
                              viewBox="0 0 48 48"
                            >
                              <path
                                fill="#FFA000"
                                d="M38,12H22l-4-4H8c-2.2,0-4,1.8-4,4v24c0,2.2,1.8,4,4,4h31c1.7,0,3-1.3,3-3V16C42,13.8,40.2,12,38,12z"
                              ></path>
                              <path
                                fill="#FFCA28"
                                d="M42.2,18H15.3c-1.9,0-3.6,1.4-3.9,3.3L8,40h31.7c1.9,0,3.6-1.4,3.9-3.3l2.5-14C46.6,20.3,44.7,18,42.2,18z"
                              ></path>
                            </svg>
                          </button>
                        )}
                      </td>

                      {/* <td>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => DeleteExcelFileData(row._id)}
                        >
                          Delete
                        </button>
                      </td> */}
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
                  color: "",
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
      <EditItemModalComponent
        children={component}
        itemmodalRef={itemModalRef}
        itemShowModal={showModal}
        itemHandleCloseModal={closeModal}
        itemTitle={modalTitle}
      />
    </main>
    </>
  );
};

export default ExcelFileUploadPage;
