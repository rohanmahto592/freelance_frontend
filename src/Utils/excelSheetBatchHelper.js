import { convertSheetToJson } from "./excelFileUploadHelper";
import { uploadJsonData } from "../Apis/excel";

export const processExcelSheetBatch = async (formData) => {
  const { orderType, excelfile } = formData;
  const jsonConvertedStatus = await convertSheetToJson(excelfile);
  if (jsonConvertedStatus.success) {
    const { jsonData } = jsonConvertedStatus;
   const response= await sendDataInBatches(jsonData, 500, orderType);
   return response;
  }
  else
  {
    return {success:false,message:'failed to convert the sheet to JSON'};
  }
};
const sendDataInBatches = async (
  data,
  batchSize,
  orderType,
) => {
  const totalObjects = data.length;
  let startIndex = 0;
  let endIndex = batchSize;
  let isAllBatchProcessed=true;
  while (startIndex < totalObjects) {
    const batch = data.slice(startIndex, endIndex);
     const response= await uploadJsonData(batch,orderType);
     if(response.data.success)
     {
      startIndex = endIndex;
      endIndex =endIndex+batchSize;
     }
     else
     {
        isAllBatchProcessed=false;
        console.log("failed to process the batch");
        break;
     }
  }
  if(isAllBatchProcessed)
  {
    return {success:true,message:'Processed'};
  }
  return {success:false,message:'failed to process the sheet in batches'};
};
