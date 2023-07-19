import axios from "axios";
export const getUsers = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getusers`,
    {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
  );

  return response;
};
export const verifyUsers=async (selectedRows)=>{
    const response=await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/verifyusers`,selectedRows,
        {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
    )
    return response
}
export const deleteUsers=async(userId)=>{
    const response=await axios.post(
        `${process.env.REACT_APP_BASE_URL}/admin/user/delete`,{userId},
        {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
    )
    return response;
}
export const addItem=async(formData)=>{
  const response=await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/additem`,formData,
    {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
  )
  return response;
}

export const fetchItems=async()=>{
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getstockitem`,
    {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
  )
  
}
export const updateCartItem=async(itemData)=>{
  return await axios.put( `${process.env.REACT_APP_BASE_URL}/admin/updateItem`,itemData,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  
  
  )
}
export const fetchItemNames=async()=>{
  return await axios.get(`${process.env.REACT_APP_BASE_URL}/admin/getItemNames`,{
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  })
}
export const addStockItem=async(data)=>{
  return await axios.post(`${process.env.REACT_APP_BASE_URL}/admin/addStock`,data,
  {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    }})
}
