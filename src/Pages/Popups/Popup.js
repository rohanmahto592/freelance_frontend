import React, { useState, useRef } from "react";
import EditItemModalComponent from "../../Components/Modal/EditItemModalComponent";
import College from "../../Components/AddCollege/College";
import ExcelHeaders from "../ExcelHeaders/ExcelHeaders";
import Countries from "../nonServicableCountries/Countries";
import CustomizeEmail from "../../Components/CustomizeEmail";
const Popup = () => {
  const [itemShowModal, setItemShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [component, setComponent] = useState(null);

  const handleOpenModal = (item) => {
    if (item === "college") {
      setComponent(<College />);
      setModalTitle("Add College");
    } else if (item === "excelHeaders") {
      setComponent(<ExcelHeaders />);
      setModalTitle("Manage Headers");
    }
    else if(item==='nonServicableCountries')
    {
      setComponent(<Countries/>);
      setModalTitle("Add Non Servicable Countries")
    }
    else if(item==='customizeEmail')
    {
      setComponent(<CustomizeEmail/>);
      setModalTitle("Customize Emails")
    }
    setItemShowModal(true);
  };

  const itemModalRef = useRef(null);

  const itemHandleCloseModal = () => {
    setItemShowModal(false);
    setComponent(null);
    setModalTitle(null);
  };

  return (
    <>
      <div className="row">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => handleOpenModal("college")}
          >
            Add College
          </button>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => handleOpenModal("excelHeaders")}
          >
            Manage Excel Headers
          </button>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => handleOpenModal("nonServicableCountries")}
          >
           Non Servicable Countries
          </button>
          <button
            className="btn btn-outline-primary mt-3"
            onClick={() => handleOpenModal("customizeEmail")}
          >
           Customize Emails
          </button>
        </div>
      </div>
      <hr />
      <EditItemModalComponent
        itemModalRef={itemModalRef}
        itemShowModal={itemShowModal}
        itemHandleCloseModal={itemHandleCloseModal}
        itemTitle={modalTitle}
        children={component}
      />
    </>
  );
};

export default Popup;
