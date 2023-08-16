import React,{useState,useRef} from "react";
import { ExcelWorkbookSheetCount } from "../../Utils/excelFileUploadHelper";
import Toast from "../../Components/Toast";
import ProcessingLoader from "../../Components/ProcessingLoader/ProcessingLoader";
import { deliveryExcelFile } from "../../Apis/excel";
const UploadDeliveryFile = () => {
    const [formData, setFormData] = useState({
        excelfile: null,
      });
const [showToast, setShowToast] = useState(false);
  const [apiError, setApiError] = useState("");
  const fileInputRef = useRef(null);
  const [isError, setIsError] = useState(true);
  const [isProcessing,setProcessing]=useState(false);
      const handleInputChange = async (event) => {
        event.preventDefault();
            setFormData({ ...formData, excelfile: event.target.files[0] });
    }
  const handleSubmit = async (event) => {
    setProcessing(true);
    event.preventDefault();
    const form = new FormData();
    form.append("file", formData.excelfile);
    form.append("userDeliveryId",sessionStorage.getItem("userDeliveryId"))
    const response=await deliveryExcelFile(form);
    if(response.data.success)
    {
      setProcessing(false);
      setApiError(response.data.message);
      setIsError(false);
      setShowToast(true);
    }
    else
    {
      setProcessing(false);
      setApiError(response.data.message);
      setIsError(true);
      setShowToast(true);
    }

  };

  return (
    <div class="container mt-5">
     <div className="row">
        <div className="col-sm-12">
        {isProcessing && <ProcessingLoader />}
        </div>

     </div>
      <div className=" row align-items-center">
        <form onSubmit={handleSubmit}>
          <div className="col-sm-12">
            <label className="input-label mb-3">
              Upload Delivery Excel File
            </label>
            <div class="input-group">
              <input
              ref={fileInputRef}
              onChange={handleInputChange}
                type="file"
                class="form-control"
                id="inputGroupFile02"
                accept=".xlsx"
                required
                name="excelFile"
              />
            </div>
          </div>
          <div className="col-sm-12 mt-3">
            <div class="input-group">
              <input
                style={{ color: "white", backgroundColor: "#000A99" }}
                type="submit"
                class="form-control"
              />
            </div>
          </div>
        </form>
      </div>
      {showToast && (
        <Toast
          message={apiError}
          setShowToast={setShowToast}
          timer={4000}
          isError={isError}
        />
      )}
    </div>
  );
};

export default UploadDeliveryFile;
