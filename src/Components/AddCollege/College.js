import React,{useEffect, useState} from 'react';
import { addColleges,fetchColleges } from '../../Apis/adminDashboard';
import Toast from '../Toast';
const College = () => {
    const[college,setCollege]=useState('');
    const[getCollege,setReceivedCollege]=useState(null);
    const [apiError, setApiError] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleChange=(event)=>{
        setCollege(event.target.value);
    }
    const AddCollegeSubmit=async(event)=>{
        event.preventDefault();
        console.log(college)
        const response= await addColleges(college);
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(false);

    }
    useEffect(()=>{
        fetchColleges().then((response)=>{
            if (response?.data?.success) {
                setReceivedCollege(response.data.message)
              } else {
                setApiError(response.data.message);
                setShowToast(true);
                setIsError(true);
              }
        });
        

    },[])
  return (
    <div>
       <form className="form-style">
       <div className="container ">
                <div className="row">
                  <div className="col-sm-6 my-2 ">
                    <label className="form-label">Listed Colleges</label>
                    <select
                     
                      class="form-select"
                      aria-label="Default select example"
                      name="itemName"
                    >
                      {getCollege?.map((item, index) => (
                        <option key={index} value={item.Name}>
                          {item.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6 my-2 ">
                    <label className="form-label">Enter College</label>
                    <input
                      className="form-control"
                      type="text"
                      name="college"
                     
                    
                      onChange={handleChange}
                    />
                  </div>
                  </div>
                  <div className='row'>

                  
                    <div className="col-sm-12 my-2">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        onClick={AddCollegeSubmit}
                      >
                        Submit
                      </button>
                   
                  </div>
                </div>
            </div>
          </form>
          {showToast && (
        <Toast
          message={apiError}
          setShowToast={setShowToast}
          timer={2000}
          isError={isError}
        />
      )}
    </div>
  );
}

export default College;
