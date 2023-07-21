import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Modal, Button } from "react-bootstrap";
import React from "react";

const EditItemModalComponent = (props) => {
  const {
    children,
    itemmodalRef,
    itemShowModal,
    itemHandleCloseModal,
    itemTitle,
  } = props;
  return (
    <Modal
      ref={itemmodalRef}
      show={itemShowModal}
      onHide={itemHandleCloseModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>{itemTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={itemHandleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditItemModalComponent;
