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
    const file = new Blob([doc.buffer], { type: doc.mimetype });
    const fileUrl = URL.createObjectURL(file);
    FileSaver.saveAs(fileUrl, doc.originalname);
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
      { id }
    );
    return response;
  } catch (err) {}
};

export const deleteUnProcessedFile = async (id) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/file/deleteIdealFile`,
      { id }
    );
    return response;
  } catch (err) {}
};
