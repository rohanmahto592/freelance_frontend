import React,{useState} from 'react';
import { updateCartItem } from '../../Apis/adminDashboard';
const Form = ({item,setApiError,setShowToast,setIsError}) => {
    const [ItemData, setItemData] = useState({
        quantity: item.quantity,
        id:item._id
      });
    const handleInputChange = (event) => {
        const { name, value } = event.target;
          setItemData({ ...ItemData, [name]: value });
        }
    const UpdateItemSubmit=async(event)=>{
        event.preventDefault();
        const response = await updateCartItem(ItemData);
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
  return (
    <div>
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
                        name="itemName"
                        disabled
                        value={item.itemName}
                      />
                    </div>
                    <div className="col-sm-6 my-2 ">
                      <label className="form-label">Quantity</label>
                      <input
                        className="form-control"
                        type="number"
                        name="quantity"
                        min="1"
                        value={ItemData.quantity}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  { item?.itemRef?.image && <div className="row">
                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <div>Current Image</div>
                        <img style={{ height: '150px', objectFit: 'contain', alignSelf: 'center'}} src={item?.itemRef?.image} alt={item.itemName} />
                    </div>
                    </div>
                    }
                  <div className="row">
                    <div className="col-sm-12 my-2">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={UpdateItemSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
          </form>
    </div>
  );
}

export default Form;
