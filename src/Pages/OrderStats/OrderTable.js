import React, { useEffect,useState } from 'react';
import { fetchOrders } from "../../Apis/adminDashboard";
const OrderTable = (props) => {
   const {excelRef}=props;
   const [orders,setOrders]=useState(null);
   useEffect(()=>{
    fetchOrders(excelRef).then((response)=>{
       if(response.data.success)
       {
        setOrders(response.data.message)
       }
    })
   },[])
 
  return (
    <div style={{maxHeight:'400px',overflowY:'auto'}}>
   <table  className="table table-striped table-bordered">
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
                    {
                        orders?.map((item,index)=>(
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item?.applicationId}</td>
                                <td>{item.trackingId[0]}</td>
                                <td>{item?.orderStatus}</td>
                                <td>{item?.orderType}</td>
                                <td>{ item.createdAt && new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}</td>
                                <td>{ item.updatedAt && new Date(item.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}</td>
                            </tr>
                        ))
                    }
                 
                </tbody>
              </table>
    </div>
  );
}

export default OrderTable;
