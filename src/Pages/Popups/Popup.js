import React,{useState,useRef} from 'react';
import EditItemModalComponent from '../../Components/Modal/EditItemModalComponent';
import College from '../../Components/AddCollege/College';

const Popup = () => {
    const [itemShowModal, setItemShowModal] = useState(false);
    const handleOpenModal = () => {
        setItemShowModal(true);
      };
      const itemModalRef = useRef(null);
      const itemHandleCloseModal = () => {
        setItemShowModal(false);
      };
  return (
    <>
        <div className='row'>
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
            <button className='btn btn-outline-primary mt-3' onClick={()=>handleOpenModal()}>Add College</button>
            </div>
            
        </div>
      <hr/>
      <EditItemModalComponent
       itemModalRef={itemModalRef}
       itemShowModal={itemShowModal}
       itemHandleCloseModal={itemHandleCloseModal}
       itemTitle="Add College"
       children={
        <College/>
       }
      
      />

     
    </>
  );
}

export default Popup;
