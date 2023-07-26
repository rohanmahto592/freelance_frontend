import XLSX from 'xlsx'
export const viewInitialExcelFile = (jsonData, name) => {
    jsonData = JSON.parse(jsonData);
    const worksheet = XLSX.utils.json_to_sheet(jsonData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
    XLSX.writeFile(workbook, `${name}.xlsx`);
  };
export const viewProcessedExcelFile = (jsonData, name) => {
    jsonData = JSON.parse(jsonData);
    const { dispatched, invalid, non_servicable,duplicates,ShipRocket_Delivery } = jsonData;
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
    XLSX.writeFile(workbook, `processed_${name}.xlsx`);
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
