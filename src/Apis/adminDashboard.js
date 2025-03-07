import axios from "axios";
export const getUsers = async (data) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/getusers`,
    {data},
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );

  return response;
};
export const verifyUsers = async (approvedUserIds, rejectedUserIds) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/verifyusers`,
    { approvedUserIds, rejectedUserIds },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const deleteUsers = async (userId) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/user/delete`,
    { userId },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const addItem = async (formData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/additem`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};

export const fetchItems = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getstockitem`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};
export const updateCartItem = async (itemData) => {
  return await axios.put(
    `${process.env.REACT_APP_BASE_URL}/admin/updateItem`,
    itemData,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};
export const fetchItemNames = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getItemNames`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};
export const addStockItem = async (data) => {
  return await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/addStock`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};
export const addColleges = async (college, address) => {
  return await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/addCollege`,
    { Name: college, Address: address },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};
export const fetchColleges = async () => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getColleges`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};

export const addEventHeader = async (name) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/addExcelHeader`,
    name,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};

export const fetchEventHeaders = async (orderType) => {
  return await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getExcelHeader`,
    {
      params: { orderType: orderType },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
};

export const deleteExcelHeader = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/deleteExcelHeader`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const DeleteCollege = async (id, collegeAddress) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/admin/deletecollege`,
    {
      params: { id: id, address: collegeAddress },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const deleteCurrentItem = async (itemId) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/admin/deleteCurrentItem`,
    {
      params: { id: itemId },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const nonServicableCountries = async (country) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/add/nonServicableCountries`,
    { country },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const fetchInvalidCountries = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/get/nonServicableCountries`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const fetchExcelSheet = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/get/excelsheetinfo`,
    {
      params: { id: id },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const fetchOrders = async (id) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/get/fetchOrders`,
    {
      params: { id: id },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const deleteNonServicableCountry = async (id) => {
  const response = await axios.delete(
    `${process.env.REACT_APP_BASE_URL}/admin/deleteCountry`,
    {
      params: { id },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const fetchAllUsers = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/get/fetchAllUsers`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const fetchUserEmails = async (type) => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/admin/getUserEmails`,
    {
      params: { type },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const addUserEmail = async (userData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/addUserEmail`,
    { userData },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const deleteUserEmail = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/admin/deleteUserEmail`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
