import axios from "axios";
import FileSaver from "file-saver";
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
