import React, { useState, useEffect, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import {
  uploadExcelFile,
  getExcelFile,
  DeleteExcelFile,
  ViewDocFile,
  fetchFile,
  deleteUnProcessedFile,
  deleteExcelOrders,
} from "../../Apis/excel";
import {
  viewInitialExcelFile,
  viewProcessedExcelFile,
  ExcelWorkbookSheetCount,
  checkExcelFileStatus,
} from "../../Utils/excelFileUploadHelper";
import ProcessingLoader from "../../Components/ProcessingLoader/ProcessingLoader";
import "../../css/ExcelFile.css";
import Toast from "../../Components/Toast";
import {
  fetchColleges,
  fetchEventHeaders,
  fetchItems,
} from "../../Apis/adminDashboard";
import EditItemModalComponent from "../../Components/Modal/EditItemModalComponent";
import { useBlocker } from "react-router-dom";
import CreateExcelHeader from "../../Components/CreateExcelHeader";
import { processExcelSheetBatch } from "../../Utils/excelSheetBatchHelper";
import { uploadFileToAwsS3 } from "../../Utils/uploadFileToS3";

const ExcelFileUploadPage = () => {
  const [formData, setFormData] = useState({
    orderType: "ADMIT/DEPOSIT",
    excelfile: null,
    docfile: null,
    university: null,
    currentItemQuantity: 0,
    currentItem: null,
    currentItemId: null,
    address: null,
  });
  const fileId = sessionStorage.getItem("fileId");
  const [excelFileData, setExcelFileData] = useState(null);
  const [isProcessing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setcurrentData] = useState(null);
  const [totalPages, settotalPages] = useState(0);
  const [perPage] = useState(10);
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
  const [isProcessed, setIsProcessed] = useState(true);
  const [isProcessedAlert, setIsProcessedAlert] = useState(false);
  const [isApiCallDone, setApiCall] = useState(fileId ? false : true);
  const [isFileFetched, setFileFetched] = useState(false);
  const intervalIdRef = useRef(null);
  const [blockNavigation, setBlockNavigation] = useState(false);

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      blockNavigation && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    const handleTabClose = (event) => {
      if (blockNavigation) event.preventDefault();
    };

    const closed = () => {
      if (blockNavigation) {
        const fileId = sessionStorage.getItem("fileId");
        fileId && deleteExcelOrders(fileId);
      }
    };

    window.addEventListener("beforeunload", handleTabClose);
    window.addEventListener("unload", closed);

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
      window.addEventListener("unload", closed);
    };
  }, [blockNavigation]);

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
      setFormData({
        orderType: "FARE",
        excelfile: null,
        docfile: null,
        university: null,
        currentItemQuantity: 0,
        currentItem: null,
        currentItemId: null,
        address: null,
      });
      fileInputRef.current.value = "";
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
  // const createExcelHeaderComponent = (missingFields) => {
  //   return (
  //     <table style={{ width: "100%" }}>
  //       <tr>
  //         <th
  //           style={{
  //             padding: "5px",
  //             border: "2px solid #dddddd",
  //             textAlign: "center",
  //           }}
  //         >
  //           S.NO
  //         </th>
  //         <th
  //           style={{
  //             padding: "5px",
  //             border: "2px solid #dddddd",
  //             textAlign: "center",
  //           }}
  //         >
  //           Title
  //         </th>
  //       </tr>
  //       {missingFields.map((item, index) => (
  //         <tr key={index}>
  //           <td
  //             style={{
  //               padding: "5px",
  //               border: "2px solid #dddddd",
  //               textAlign: "center",
  //             }}
  //           >
  //             {index + 1}
  //           </td>
  //           <td
  //             style={{
  //               fontFamily: "sans-serif",
  //               padding: "5px",
  //               border: "2px solid #dddddd",
  //               textAlign: "center",
  //             }}
  //           >
  //             {item}
  //           </td>
  //         </tr>
  //       ))}
  //     </table>
  //   );
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBlockNavigation(true);
    setIsProcessed(false);
    const isRequiredFieldsPresent = handleRequiredFieldsOnSubmit();
    if (!isRequiredFieldsPresent) return;
    const payload = {};
    payload.orderType = formData.orderType;
    payload.fileName =
      formData.excelfile?.name.replace(/\s/g, "") ||
      `FARE${new Date().toDateString()}.`.replace(/\s/g, "");

    if (formData.orderType === "FARE") {
      if (Object.keys(itemsWithUniversity).length === 0) {
        return;
      }
      payload.items = JSON.stringify(itemsWithUniversity);

      sessionStorage.getItem("userType") === "SELF" &&
        (payload.address = formData.address);
    } else if (formData.orderType === "DPM") {
      payload.university = formData.university;
    }
    setProcessing(true);
    setApiCall(false);

    const excelSheetStatus =
      formData.orderType !== "FARE"
        ? await processExcelSheetBatch(formData)
        : { success: true };

    if (excelSheetStatus?.success) {
      excelSheetStatus?.jsonData &&
        (payload.proccessedExcelFilePath = await uploadFileToAwsS3(
          formData,
          excelSheetStatus.jsonData,
          "processed",
          "excel"
        ));
      excelSheetStatus?.fileId && (payload.fileId = excelSheetStatus.fileId);

      if (formData.orderType !== "FARE" && formData.excelfile) {
        payload.initialExcelFileSize = formData.excelfile.length;
        payload.initialExcelFilePath = await uploadFileToAwsS3(
          formData,
          excelSheetStatus.orignalJson,
          "initial",
          "excel"
        );
      }

      if (formData.docfile) {
        payload.docFilePath = await uploadFileToAwsS3(
          formData,
          null,
          null,
          "doc"
        );
      }
      payload.userName = sessionStorage.getItem("userName");
      const response = await uploadExcelFile(payload);
      if (!response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setProcessing(false);
        setApiCall(true);
        setIsError(true);
        if (response.data.headerInvalid) {
          setShowModal(true);
          setComponent(
            <CreateExcelHeader missingFields={response?.data?.missingFields} />
          );
          setModalTitle(
            <div
              style={{ fontSize: "15px", letterSpacing: "1px" }}
              class="alert alert-danger"
              role="alert"
            >
              Required Headers are not present for {response.data.orderType}
              ,check from the missing list.
            </div>
          );
        }
      } else {
        setApiError(response.data.message);
        setIsProcessed(true);
        setIsProcessedAlert(true);
        setBlockNavigation(false);
        sessionStorage.removeItem("fileId");
        setShowToast(true);
        setProcessing(false);
        setIsError(false);
      }
    } else {
      setApiError("Failed to Process the ExcelSheet");
      setIsProcessed(true);
      setIsProcessedAlert(true);
      setBlockNavigation(false);
      sessionStorage.removeItem("fileId");
      setShowToast(true);
      setProcessing(false);
      setIsError(true);
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
    setFileFetched(true);
    const response = await fetchFile({ _id: excelId, type: type });
    setFileFetched(false);
    if (response.data.success) {
      const row = response.data.message;
      if (type === "docFile") {
        ViewDocFile(row.docFile);
      } else if (type === "initialExcelFile") {
        row.initialExcelFile &&
          viewInitialExcelFile(
            row?.initialExcelFile,
            row.name ? row.name : `FARE`
          );
      } else {
        row.processedExcelFile &&
          viewProcessedExcelFile(
            row.processedExcelFile,
            row.name ? row.name : `FARE`
          );
      }
    }
  };
  const fetchExcelFile = async (type) => {
    const response = await fetchEventHeaders(type);
    if (response.data.success && response.data.message.length > 0) {
      const data = response.data.message;
      let resp = [{}];
      data.forEach((obj) => (resp[0][obj.name.toLowerCase()] = ""));
      const sortedArr = resp.map((obj) => {
        const sortedKeys = Object.keys(obj).sort();
        const sortedObj = {};
        sortedKeys.forEach((key) => {
          sortedObj[key] = obj[key];
        });
        return sortedObj;
      });
      viewInitialExcelFile(sortedArr, type === "DPM" ? "DPM" : "ADMIT_DEPOSIT");
    }
  };
  return (
    <>
      {/* <ReactRouterPrompt
        when={state}
        beforeConfirm={async () => {
          console.log("confrim");
        }}
        beforeCancel={() => console.log("cancel")}
      >
        {({ isActive, onConfirm, onCancel }) =>
          isActive && (
            <div className="lightbox">
              <div className="container">
                <p>Do you really want to leave?</p>
                <button type="button" onClick={onCancel}>
                  Cancel
                </button>
                <button type="submit" onClick={onConfirm}>
                  Ok
                </button>
              </div>
            </div>
          )
        }
      </ReactRouterPrompt> */}
      {isProcessedAlert && (
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            letterSpacing: "2px",
            fontFamily: "sans-serif",
          }}
          class="alert alert-success"
          role="alert"
        >
          <span>ExcelSheet data processed!!</span>
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center m-4 flex-wrap">
        <button
          className="btn btn-outline-primary mx-1 my-1"
          onClick={() => fetchExcelFile("ADMIT/DEPOSIT")}
        >
          Admit/Deposit Template ExcelSheet{" "}
          <i
            style={{ paddingLeft: "5px", color: "orange" }}
            class="bi bi-download"
          ></i>
        </button>
        <button
          onClick={() => fetchExcelFile("DPM")}
          class="btn btn-outline-primary mx-1 my-1"
        >
          {" "}
          DirectPrintMail Template ExcelSheet{" "}
          <i
            style={{ paddingLeft: "5px", color: "orange" }}
            class="bi bi-download"
          ></i>
        </button>
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
                    formData.orderType === "FARE" ||
                    formData.orderType === "DPM"
                  }
                >
                  <option
                    disabled={
                      formData.orderType === "FARE" ||
                      formData.orderType === "DPM"
                        ? true
                        : false
                    }
                  >
                    Please select university
                  </option>
                  {receivedCollege?.map((college, index) => {
                    if (
                      sessionStorage.getItem("userType") === "SELF" &&
                      college.Name.toLowerCase() === "self"
                    ) {
                      return (
                        <option
                          selected={index === 0}
                          key={index}
                          value={college.Name + ", " + college.Address}
                        >
                          {college.Name + ", " + college.Address}
                        </option>
                      );
                    } else if (
                      sessionStorage.getItem("userType") !== "SELF" &&
                      college.Name.toLowerCase() !== "self"
                    ) {
                      return (
                        <option
                          selected={index === 0}
                          key={index}
                          value={college.Name + ", " + college.Address}
                        >
                          {college.Name + ", " + college.Address}
                        </option>
                      );
                    }
                  })}
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
                  {sessionStorage.getItem("userType") === "SELF" && (
                    <div className="col-sm-12  mt-2 mb-4">
                      <label className="form-label">Enter Address</label>
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="form-control"
                        type="text"
                        required
                        placeholder="Enter complete address"
                      ></input>
                    </div>
                  )}
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

                      borderRadius: "5px",
                    }}
                    class="table table-striped table-bordered"
                  >
                    <thead style={{ fontFamily: "sans-serif" }}>
                      <tr>
                        <th
                          style={{
                            backgroundColor: "slateblue",
                            color: "white",
                          }}
                          scope="col"
                        >
                          <i class="bi bi-eyedropper"></i>College
                        </th>
                        <th
                          style={{
                            backgroundColor: "slateblue",
                            color: "white",
                          }}
                          scole="col"
                        >
                          {" "}
                          <i class="bi bi-diagram-3"></i>Items
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(itemsWithUniversity).map((uni) => (
                        <tr>
                          <td className="col-sm-4">{uni}</td>
                          {itemsWithUniversity[uni].map((item, index) => (
                            <td
                              key={index}
                              className="col-sm-3"
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
                  disabled={!isProcessed}
                />
              </div>
            </div>
          </form>
          {isProcessing && <ProcessingLoader />}
          {isFileFetched && (
            <div style={{ marginTop: "10px" }}>
              <RotatingLines width="30" />
            </div>
          )}
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
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      Size
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      File Count
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      View
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      Size
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      {" "}
                      Dispatched Count
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      {" "}
                      ShipRocket_Delivery Count
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
                      {" "}
                      IndianPost_Delivery Count
                    </th>
                    <th
                      style={{ backgroundColor: "#5B7CFD", color: "#E9F8FD" }}
                    >
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
                            : `FARE ${new Date(
                                row.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              })}`}
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
                            style={{ outline: "none", border: "none" }}
                            className="btn btn-outline-primary"
                            onClick={() =>
                              fetchFileData(row._id, "initialExcelFile")
                            }
                          >
                            <i class="bi bi-cloud-arrow-down-fill"></i>
                          </button>
                        </td>
                        <td>{row.processedFileSize}</td>
                        <td>{row.processedExcelFileDispatchedCount}</td>
                        <td>{row.processedExcelFileShipRocketDeliveryCount}</td>
                        <td>{row.processedExcelFileIndianPostDeliveryCount}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              fetchFileData(row._id, "processedExcelFile")
                            }
                            style={{
                              outline: "none",
                              border: "none",
                            }}
                          >
                            <i class="bi bi-cloud-arrow-down-fill"></i>
                          </button>
                        </td>
                        <td>
                          {row.isDocPresent && (
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => fetchFileData(row._id, "docFile")}
                              style={{
                                outline: "none",
                                border: "none",
                              }}
                            >
                              <i class="bi bi-file-earmark-pdf-fill"></i>
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
            timer={3000}
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

      {blocker.state === "blocked" ? (
        <div>
          <p>Are you sure you want to leave?</p>
          <button onClick={() => blocker.proceed()}>Proceed</button>
          <button onClick={() => blocker.reset()}>Cancel</button>
        </div>
      ) : null}
    </>
  );
};

export default ExcelFileUploadPage;
