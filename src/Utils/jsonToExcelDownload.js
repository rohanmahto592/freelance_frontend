
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
export const exportToExcel = (json,fileName) => {
    console.log(json);
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {type: 'application/octet-stream'});
    saveAs(file, fileName);
 };