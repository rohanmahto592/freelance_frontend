import React, { useState, useEffect } from "react";
import { CountriesList } from "../../Utils/countries";
import {
  nonServicableCountries,
  fetchInvalidCountries,
  deleteNonServicableCountry,
} from "../../Apis/adminDashboard";
import Toast from "../../Components/Toast";
const Countries = () => {
  const [country, setCountry] = useState(null);
  const [apiError, setApiError] = useState("");
  const [showToast, setToast] = useState(false);
  const [isError, setIsError] = useState(false);
  const [countryList, setCountryList] = useState(null);
  useEffect(() => {
    fetchInvalidCountries().then((response) => {
      setCountryList(response.data.message);
    });
  }, [isError]);
  const handleCountrySubmit = async (event) => {
    event.preventDefault();
    if (!country) {
      return;
    }
    const response = await nonServicableCountries(country);
    setApiError(response.data.message);
    setToast(true);
    response?.data?.success ? setIsError(false) : setIsError(true);
  };

  const deleteCountry = async (event, id) => {
    event.preventDefault();
    const response = await deleteNonServicableCountry(id);
    setApiError(response.data.message);
    setToast(true);
    response?.data?.success ? setIsError(false) : setIsError(true);
  };

  return (
    <div className="container">
      <div className="row my-2">
        <div className="col-sm-12">
          <form className="form" onSubmit={handleCountrySubmit}>
            <label className="form-label">Enter Country</label>

            <input
              class="form-control"
              list="countrylistOptions"
              id="exampleDataList"
              placeholder="Type to search..."
              onChange={(event) => setCountry(event.target.value)}
            />
            <datalist id="countrylistOptions">
              {CountriesList?.map((country, index) => (
                <option key={index} value={country.name} />
              ))}
            </datalist>
            <input
              className="btn btn-outline-primary w-100 mt-2"
              type="submit"
            />
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-12">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>NAME</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {countryList?.map((country, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{country.name}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger"
                      onClick={(e) => deleteCountry(e, country._id)}
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
      {showToast && (
        <Toast
          message={apiError}
          setShowToast={setToast}
          timer={2000}
          isError={isError}
        />
      )}
    </div>
  );
};

export default Countries;
