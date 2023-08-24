import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../Apis/adminDashboard";
import { Dna } from "react-loader-spinner";
const OrderTable = (props) => {
  const { excelRef } = props;
  const [OriginalOrders, setOriginalOrders] = useState(null);
  const [CopyOrders,setCopyOrders]=useState(null);
  const [isLoading, setLoading] = useState(false);
  const[searchValue,setSearchValue]=useState('');
  const[isInitialData,setInitialData]=useState(false);
  useEffect(() => {
    setLoading(true);
    fetchOrders(excelRef).then((response) => {
      if (response.data.success) {
      
        setLoading(false);
        setOriginalOrders(response.data.message);
        setInitialData(response.data.isOne);
        setCopyOrders(response.data.message)
      }
    });
  }, []);
  useEffect(()=>{
    const copyDuplicates=OriginalOrders;
    const filteredData = copyDuplicates?.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );
  setCopyOrders(filteredData);

  },[searchValue])

  return (
    <>
      {isLoading ? (
        <div style={{display:'flex',justifyContent:'center',justifyItems:'center'}}>
       <Dna
  visible={true}
  height="80"
  width="80"
  ariaLabel="dna-loading"
  wrapperStyle={{}}
  wrapperClass="dna-wrapper"
/>
        </div>
      ) : (
        <>
        <div style={{margin:'auto',position:'sticky'}} className="col-sm-6">
          <input onChange={(event)=>setSearchValue(event.target.value)} placeholder="Search on any column" className="form-control mt-2 mb-4"/>
          </div>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          
         
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Application ID</th>
                <th>Tracking ID</th>
                <th>Order Status</th>
                <th>Order Type</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
              </tr>
            </thead>
            <tbody>
              {CopyOrders?.map((item, index) => (
               !isInitialData?<tr key={index}>
                 <td>{index + 1}</td>
                  <td>{item?.applicationId}</td>
                  <td>{item?.trackingId}</td>
                  <td>{item?.orderStatus}</td>
                  <td>{item?.orderType}</td>
                  <td>
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                  </td>
                  <td>
                    {item.updatedAt &&
                      new Date(item.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })}
                  </td>
                </tr>: <tr key={index}>
                 <td>{index + 1}</td>
                  <td>{item["Application ID"] || item["application id"]}</td>
                  <td>NA</td>
                  <td>Pending</td>
                  <td>{item["Admissions Status"]}</td>
                  <td>
                    NA
                  </td>
                  <td>
                    NA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </>
  );
};

export default OrderTable;
