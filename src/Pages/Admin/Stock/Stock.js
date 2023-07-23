import React, { useState, useRef, useEffect } from "react";
import {
  addStockItem,
  addItem,
  fetchItemNames,
  fetchItems,
  fetchColleges,
  deleteCurrentItem
} from "../../../Apis/adminDashboard";
import EditItemModalComponent from "../../../Components/Modal/EditItemModalComponent";
import Toast from "../../../Components/Toast";
import Form from "../../../Components/EditItemForm/Form";
import ModalComponent from "../../../Components/Modal/ModalComponent";
const Stock = () => {
  const [stockData, setStockData] = useState({
    itemName: "",
    quantity: null,
    university: "",
    itemRef: "",
  });
  const [activeTab, setActiveTab] = useState("tabs-3");
  const [itemNames, setItemNames] = useState(null);
  const [ItemData, setItemData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [items, setItems] = useState(null);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [itemShowModal, setItemShowModal] = useState(false);
  const [currentEditableItem, setCurrentEditableItem] = useState(null);
  const [colleges, setcolleges] = useState(null);
  const itemModalRef = useRef(null);
  const stockModalRef=useRef(null);
  const [showModal, setShowModal] = useState(false);
  const[itemId,setItemId]=useState(null);
  const itemHandleCloseModal = () => {
    setItemShowModal(false);
  };
  useEffect(() => {
    if (activeTab === "tabs-3") {
      fetchAllStockItems();
    } else if (activeTab === "tabs-4") {
    } else if (activeTab === "tabs-5") {
      getItemNames();
    }
  }, [activeTab]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "image") {
      setItemData({ ...ItemData, [name]: event.target.files[0] });
    } else {
      setItemData({ ...ItemData, [name]: value });
    }
  };
  async function getItemNames() {
    const response = await fetchItemNames();
    const collegeNames = await fetchColleges();
    console.log(response.data.message);
    if (response.data.success) {
      setItemNames(response.data.message);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
    if (collegeNames.data.success) {
      setcolleges(collegeNames.data.message);
    } else {
      setApiError(collegeNames.data.message);
      setShowToast(true);
      setIsError(true);
    }
  }
  const handleStockChange = (event) => {
    const { name, value } = event.target;
    if (name === "itemName") {
      const [itemRef, itemName] = value.split(",");
      setStockData({ ...stockData, itemName: itemName, itemRef: itemRef });
    } else {
      setStockData({ ...stockData, [name]: value });
    }
  };
  const AddStockSubmit = async (event) => {
    event.preventDefault();
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
  };
  const editCurrentItem = (item) => {
    setItemShowModal(true);
    setCurrentEditableItem(item);
  };

  const handleTabChange = (event) => {
    setActiveTab(event?.target?.href?.split("#")[1]);
  };
  const AddItemSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("file", ItemData.image);
    form.append("item", JSON.stringify(ItemData));
    const response = await addItem(form);
    if (response.data.success) {
      setItemData({
        name: "",
        description: "",
        image: null,
      });
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(true);
    }
  };
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
  async function deleteCurrentStockItem(){
    const response = await deleteCurrentItem(itemId);
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
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleOpenModal = (userId) => {
    setItemId(userId);
    setShowModal(true);
  };
  return (
    <>
      <div id="table-row" className="row m-3  ">
        <h3 style={{ textAlign: "center" }}>Stocks</h3>
        <ul
          class="nav nav-tabs mb-3"
          id="ex2"
          onClick={handleTabChange}
          role="tablist"
        >
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
            style={{maxHeight:'400px',overflowY:'auto'}}
          >
            <table  className="table table-striped table-bordered">
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
                        className="btn btn-outline-primary mb-2"
                      >
                        Edit
                      </button>
                      {" "}
                      <button

                        onClick={() => handleOpenModal(item._id)}
                        className="btn btn-outline-danger mb-2"
                      >
                       Delete
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
                      <option selected disabled>
                        Select item
                      </option>
                      {itemNames?.map((item, index) => (
                        <option key={index} value={item._id + "," + item.name}>
                          {item.name}
                        </option>
                      ))}
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
                      <option disabled selected>
                        Select University
                      </option>
                      {colleges?.map((college) => (
                        <option value={college.Name+', '+college.Address}>{college.Name+","+college.Address}</option>
                      ))}
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
      <ModalComponent
      modalRef={stockModalRef}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      handleSaveChanges={deleteCurrentStockItem}
      title="Stock Action"
      body="Are you really want to delete this item?"

       />
    </>
  );
};

export default Stock;
