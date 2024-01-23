import XLSX from "xlsx";
import { fetchFileStatus } from "../Apis/excel";
export const viewInitialExcelFile = (jsonData, name) => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);
  XLSX.writeFile(workbook, `${name}.xlsx`,{compression:true});
};
export const convertSheetToJson=(excelFile)=>{
  return new Promise((resolve, reject) => {
    if (excelFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve({ success: true, jsonData: json });
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsBinaryString(excelFile);
    } else {
      resolve({ success: false, jsonData: [] });
    }
  });
}
export const viewProcessedExcelFile = (jsonData, name) => {
  let {
    dispatched,
    invalid,
    non_servicable,
    duplicates,
    ShipRocket_Delivery,
    IndianPost_Delivery,
  } = jsonData;
  const workbook = XLSX.utils.book_new();
  const sheet1 = XLSX.utils.json_to_sheet(dispatched);
  XLSX.utils.book_append_sheet(workbook, sheet1, "Dispatched");
  const sheet2 = XLSX.utils.json_to_sheet(invalid);
  XLSX.utils.book_append_sheet(workbook, sheet2, "Invalid");
  const sheet3 = XLSX.utils.json_to_sheet(non_servicable);
  XLSX.utils.book_append_sheet(workbook, sheet3, "Non_Servicable");
  const sheet4 = XLSX.utils.json_to_sheet(duplicates);
  XLSX.utils.book_append_sheet(workbook, sheet4, "Duplicates Entry");
  const sheet5 = XLSX.utils.json_to_sheet(ShipRocket_Delivery);
  XLSX.utils.book_append_sheet(workbook, sheet5, "ShipRocket_Delivery");
  const sheet6 = XLSX.utils.json_to_sheet(IndianPost_Delivery);
  XLSX.utils.book_append_sheet(workbook, sheet6, "IndianPost_Delivery");
  XLSX.writeFile(workbook, `processed_${name}.xlsx`,{compression:true});
};

export const ExcelWorkbookSheetCount = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      if (workbook.SheetNames.length !== 1) {
        resolve({
          success: false,
          message: "Excel Workbook must have only one sheet",
        });
      } else {
        resolve({ success: true, message: "" });
      }
    };
    reader.readAsBinaryString(file);
  });
};

export const checkExcelFileStatus = async (id) => {
  const fileStatus = await fetchFileStatus(id);
  return fileStatus;
};
