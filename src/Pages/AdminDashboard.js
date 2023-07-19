import React, { useEffect, useState, useRef } from "react";
import {
  getUsers,
  verifyUsers,
  deleteUsers,
  addItem,
  fetchItems,
  fetchItemNames,
  addStockItem

} from "../Apis/adminDashboard";
import Form from "../Components/EditItemForm/Form";
import Toast from "../Components/Toast";
import cross from "../Assets/Images/cross.png";
import verified from "../Assets/Images/check.png";
import ModalComponent from "../Components/Modal/ModalComponent";
import Pagination from "../Components/Pagination/Pagination";
import "../css/Admin.css";
import EditItemModalComponent from "../Components/Modal/EditItemModalComponent";
const AdminDashboard = () => {
  const [items, setItems] = useState(null);
  const [verifiedusers, setVerifiedUsers] = useState(null);
  const [nonverifiedusers, setNonVerifiedUsers] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemShowModal, setItemShowModal] = useState(false);
  const [currentEditableItem, setCurrentEditableItem] = useState(null);
  const [selectedUserId, setUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [postNumber] = useState(5);
  const currentPageNumber = pageNumber * postNumber - postNumber;
  const [activeTab, setActiveTab] = useState('tabs-3');
  const[itemNames,setItemNames]=useState(null);
  const [ItemData, setItemData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [stockData,setStockData]=useState({
    itemName:"",
    quantity:null,
    university:"",
    itemRef:"",

  })

  async function fetchAllStockItems() {
    const response = await fetchItems();
    console.log(response.data);
    if (response.data.success) {
      setItems(response.data.message);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  }
  async function getItemNames(){
    const response=await fetchItemNames();
    console.log(response.data.message);
    if (response.data.success) {
      setItemNames(response.data.message);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setItemData({ ...ItemData, [name]: event.target.files[0] });
    } else {
      setItemData({ ...ItemData, [name]: value });
    }
  };
  const handleStockChange=(event)=>{
    const {name,value}=event.target
    if(name==='itemName')
    {
      const [itemRef, itemName] = value.split(",");
      setStockData({...stockData,"itemName":itemName, 'itemRef':itemRef});
    }
    else
    {
      setStockData({...stockData,[name]:value});
    }
  }
  const handlePrev = () => {
    if (pageNumber === 1) return;
    setPageNumber(pageNumber - 1);
  };
  const handleNext = () => {
    setPageNumber(pageNumber + 1);
  };
  const handleSaveChanges = async () => {
    try {
      const response = await deleteUsers(selectedUserId);
      if (response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    } catch (err) {
      console.log(err);
    }
    handleCloseModal();
  };
  const modalRef = useRef(null);
  const itemModalRef = useRef(null);
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const itemHandleCloseModal = () => {
    setItemShowModal(false);
  };
  const handleOpenModal = (userId) => {
    setUserId(userId);
    setShowModal(true);
  };
  useEffect(() => {
    async function getAllUsers() {
      try {
        const response = await getUsers();

        if (response.data.success) {
          if (response?.data?.message[1]?.isVerified) {
            setVerifiedUsers(
              response.data.message[1].users.splice(
                currentPageNumber,
                postNumber
              )
            );
            setNonVerifiedUsers(
              response.data.message[0].users.splice(
                currentPageNumber,
                postNumber
              )
            );
          } else {
            setVerifiedUsers(
              response.data.message[0].users.splice(
                currentPageNumber,
                postNumber
              )
            );
            setNonVerifiedUsers(
              response.data.message[1].users.splice(
                currentPageNumber,
                postNumber
              )
            );
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    getAllUsers();
  }, [pageNumber]);
  useEffect(()=>{
    if(activeTab==='tabs-3')
    {
      fetchAllStockItems()
    }
    else if(activeTab==='tabs-4')
    {

    }
    else if(activeTab==='tabs-5')
    {
      getItemNames();
    }

  },[activeTab])
  const handleSelectRow = (event, rowData) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, rowData]);
    } else {
      setSelectedRows(selectedRows.filter((row) => row !== rowData));
    }
  };
  const verifyUser = async () => {
    if (selectedRows.length > 0) {
      const response = await verifyUsers(selectedRows);
      console.log(response);
      if (response.data.success) {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    }
  };

  const AddItemSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("file", ItemData.image);
    form.append("item", JSON.stringify(ItemData));
    const response = await addItem(form);
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
const AddStockSubmit=async(event)=>{
  event.preventDefault();
  console.log(stockData)
  const response = await addStockItem(stockData);
    if (response.data.success) {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
}
  const editCurrentItem = (item) => {
    setItemShowModal(true);
    setCurrentEditableItem(item);
  };

  const handleTabChange=(event)=>{
   setActiveTab(event?.target?.href?.split('#')[1]);
  }

  return (
    <>
      <div
        style={{ overflow: "auto", maxHeight: "100vh" }}
        className="container "
      >
        <div id="table-row" className="row m-3 ">
          <ul class="nav nav-tabs mb-3" id="ex1" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                id="ex1-tab-1"
                data-bs-toggle="tab"
                href="#ex1-tabs-1"
                role="tab"
                aria-controls="ex1-tabs-1"
                aria-selected="true"
              >
                Authorized
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="ex1-tab-2"
                data-bs-toggle="tab"
                href="#ex1-tabs-2"
                role="tab"
                aria-controls="ex1-tabs-2"
                aria-selected="false"
              >
                Unauthorized
              </a>
            </li>
          </ul>
          <div class="tab-content" id="ex1-content">
            <div
              class="tab-pane fade show active"
              id="ex1-tabs-1"
              role="tabpanel"
              aria-labelledby="ex1-tab-1"
            >
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Verified</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verifiedusers?.map((user, index) => (
                    <tr key={index}>
                      <td>{user?.firstName}</td>
                      <td>{user?.lastName}</td>
                      <td>{user?.email}</td>
                      <td>{user?.userType}</td>
                      <td>
                        <img
                          style={{ width: "3vh", height: "3vh" }}
                          src={verified}
                          alt="cross"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenModal(user?._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                handleNext={handleNext}
                handlePrev={handlePrev}
                pageNumber={pageNumber}
              />
            </div>
            <div
              class="tab-pane fade"
              id="ex1-tabs-2"
              role="tabpanel"
              aria-labelledby="ex1-tab-2"
            >
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Verified</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nonverifiedusers?.map((user, index) => (
                    <tr key={index}>
                      <td>{user?.firstName}</td>
                      <td>{user?.lastName}</td>
                      <td>{user?.email}</td>
                      <td>{user?.userType}</td>
                      <td>
                        <img
                          style={{ width: "3vh", height: "3vh" }}
                          src={cross}
                          alt="cross"
                        />
                      </td>
                      <th>
                        <input
                          type="checkbox"
                          onChange={(event) => handleSelectRow(event, user._id)}
                        />
                      </th>
                    </tr>
                  ))}
                </tbody>
              </table>
              {nonverifiedusers && nonverifiedusers.length > 0 && (
                <div className="d-grid gap-2 col-3 mx-auto">
                  <button
                    onClick={() => verifyUser()}
                    className="btn btn-outline-primary "
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="table-row" className="row m-3  ">
          <ul class="nav nav-tabs mb-3" id="ex2" onClick={handleTabChange} role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link active"
                id="tab-3"
                data-bs-toggle="tab"
                href="#tabs-3"
                role="tab"
                aria-controls="tabs-3"
                aria-selected="true"
              >
                Current Stock
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="tab-4"
                data-bs-toggle="tab"
                href="#tabs-4"
                role="tab"
                aria-controls="tabs-4"
                aria-selected="false"
              >
                Add Item
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                id="tab-5"
                data-bs-toggle="tab"
                href="#tabs-5"
                role="tab"
                aria-controls="tabs-5"
                aria-selected="false"
              >
                Add Stock
              </a>
            </li>
          </ul>
          <div class="tab-content" id="ex-content">
            <div
              class="tab-pane fade show active"
              id="tabs-3"
              role="tabpanel"
              aria-labelledby="tab-3"
            >
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>university</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.itemName}</td>
                      <td>{item?.itemRef?.description}</td>
                      <td>{item?.quantity}</td>
                      <td>{item?.university}</td>
                      <td>
                        <img
                          style={{ width: "5vh", height: "5vh" }}
                          src={item?.itemRef?.image}
                          alt="cross"
                        />
                      </td>
                      <td>
                        {" "}
                        <button
                          onClick={() => editCurrentItem(item)}
                          className="btn btn-outline-primary"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              class="tab-pane fade show"
              id="tabs-4"
              role="tabpanel"
              aria-labelledby="tab-4"
            >
              <form className="form-style">
                <div className="container ">
                  <div className="row">
                    <div className="col-sm-6 my-2 ">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        placeholder="Item Name"
                        required
                        type="text"
                        name="name"
                        value={ItemData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-sm-6 my-2">
                      <label className="form-label">Description</label>
                      <div class="input-group">
                        <textarea
                          type="text"
                          class="form-control"
                          value={ItemData.description}
                          name="description"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <label className="form-label">Item Image</label>
                    <div
                      style={{
                        borderRadius: "10px",
                        border: "4px dotted whitesmoke",
                      }}
                      className="col-sm-12 p-4"
                    >
                      <div class="input-group">
                        <input
                          type="file"
                          class="form-control"
                          accept=".img,.jpeg,.jpg,.png"
                          name="image"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-12 my-2">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={AddItemSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div
              class="tab-pane fade show"
              id="tabs-5"
              role="tabpanel"
              aria-labelledby="tab-5"
            >
              <form className="form-style">
                <div className="container ">
                  <div className="row">
                    <div className="col-sm-4 my-2 ">
                      <label className="form-label">Item</label>
                      <select
                      onChange={handleStockChange}
                        class="form-select"
                        aria-label="Default select example"
                        name="itemName"
                      >
                        <option disabled>Select item</option>
                        {
                          itemNames?.map((item,index)=>(
                            <option key={index} value={item._id+','+item.name}>{item.name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div className="col-sm-4 my-2 ">
                      <label className="form-label">Quantity</label>
                      <input
                        className="form-control"
                        type="number"
                        name="quantity"
                        min="1"
                        value={stockData.quantity}
                        onChange={handleStockChange}
                      />
                    </div>
                    <div className="col-sm-4 my-2">
                      <label className="form-label">University</label>
                      <select
                      onChange={handleStockChange}
                        class="form-select"
                        aria-label="Default select example"
                        name="university"
                      >
                        <option disabled selected>Select University</option>
                        <option value="SRM university">One</option>
                        <option value="Galgotia University">Two</option>
                        <option value="GL Bajaj">Three</option>
                      </select>
                    </div>
                  </div>
                 

                  <div className="row">
                    <div className="col-sm-12 my-2">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={AddStockSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ModalComponent
        modalRef={modalRef}
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleSaveChanges={handleSaveChanges}
        title="User Action"
        body="Are you really want to delete the user?"
      />

      <EditItemModalComponent
        itemModalRef={itemModalRef}
        itemShowModal={itemShowModal}
        itemHandleCloseModal={itemHandleCloseModal}
        itemTitle="Edit Current Stock"
        children={
          <Form
            item={currentEditableItem}
            setApiError={setApiError}
            setIsError={setIsError}
            setShowToast={setShowToast}
          />
        }
      />

      {showToast && (
        <Toast
          message={apiError}
          setShowToast={setShowToast}
          timer={2000}
          isError={isError}
        />
      )}
    </>
  );
};

export default AdminDashboard;
