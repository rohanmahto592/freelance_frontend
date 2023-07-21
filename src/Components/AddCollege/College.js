import React, { useEffect, useState } from "react";
import {
  addColleges,
  fetchColleges,
  DeleteCollege,
} from "../../Apis/adminDashboard";
import Toast from "../Toast";
const College = () => {
  const [college, setCollege] = useState("");
  const [address, setAddress] = useState("");
  const [getCollege, setReceivedCollege] = useState(null);
  const [apiError, setApiError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isCollegeAdded, setCollegeAdded] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "address") {
      setAddress(value);
    }
    if (name === "college") {
      setCollege(event.target.value);
    }
  };
  const AddCollegeSubmit = async (event) => {
    event.preventDefault();
    const response = await addColleges(college,address);
    if (response.data.success) {
      setCollegeAdded(true);
    }
    setApiError(response.data.message);
    setShowToast(true);
    setIsError(false);
  };
  useEffect(() => {
    fetchColleges().then((response) => {
      if (response?.data?.success) {
        setReceivedCollege(response.data.message);
      } else {
        setApiError(response.data.message);
        setShowToast(true);
        setIsError(true);
      }
    });
  }, [isCollegeAdded]);
  const deleteCollege = async (event, id) => {
    event.preventDefault();
    const response = await DeleteCollege(id);
    if (response.data.success) {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    } else {
      setApiError(response.data.message);
      setShowToast(true);
      setIsError(false);
    }
  };
  return (
    <div>
      <form className="form-style">
        <div className="container ">
          <div className="row">
            <div className="col-sm-12 my-2 ">
              <label className="form-label">Enter College</label>
              <input
                className="form-control"
                type="text"
                name="college"
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-12 my-2 ">
              <label className="form-label">Enter College Address</label>
              <input
                className="form-control"
                type="text"
                name="address"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
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
          <div className="row my-2">
            <div
              style={{ maxHeight: "300px", overflowY: "auto" }}
              className="col-sm-12"
            >
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>COLLEGE NAME</th>
                    <th>COLLEGE ADDRESS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {getCollege?.map((college, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{college.Name}</td>
                      <td>{college.Address}</td>
                      <td>
                        <button
                          onClick={(event) => deleteCollege(event, college._id)}
                          className="btn btn-outline-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
};

export default College;
