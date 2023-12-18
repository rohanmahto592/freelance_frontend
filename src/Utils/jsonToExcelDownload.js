
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export const exportToExcel = (json,fileName) => {
    const newArray = json?.map(obj => {
        const { __v,_id, ...rest } = obj; 
        return rest;
      });
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(newArray);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(file, fileName);
 };