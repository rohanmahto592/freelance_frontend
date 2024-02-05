import axios from "axios";

export const uploadJsonData = async (
  jsonData,
  orderType,
  university,
  fileId
) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/processJsonExcelData`,
    { data: JSON.stringify(jsonData), orderType, university, fileId },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const uploadExcelFile = async (data) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/processExcel`,
    data,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const getExcelFile = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/getExcelSheet`,
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const DeleteExcelFile = async (id) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/processExcel/delete`,
    { id },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    }
  );
  return response;
};
export const ViewDocFile = (doc) => {
  try {
    const data = Uint8Array.from(doc.buffer.data);
    const file = new Blob([data.buffer], { type: doc.mimetype });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.originalname;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};
export const deliveryExcelFile = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/delivery/uploadExcel`,
      data,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (err) {}
};
export const fetchFile = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/file/getFile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (err) {}
};
export const fetchFileStatus = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/file/getFileStatus`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (err) {}
};

export const deleteUnProcessedFile = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/file/deleteIdealFile`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (err) {}
};

export const deleteExcelOrders = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/file/deleteExcelOrders`,
      { fileId: id },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response;
  } catch (err) {}
};
