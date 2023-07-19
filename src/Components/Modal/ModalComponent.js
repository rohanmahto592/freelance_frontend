import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import { Modal,Button } from 'react-bootstrap';
import React from 'react';

const ModalComponent = (props) => {
  const {modalRef,showModal,handleCloseModal,handleSaveChanges,title,body}=props;
  return (
    <Modal ref={modalRef} show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {body}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSaveChanges}>Submit</Button>
    </Modal.Footer>
  </Modal>
  );
}

export default ModalComponent;
