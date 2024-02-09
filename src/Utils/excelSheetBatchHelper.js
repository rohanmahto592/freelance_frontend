import { convertSheetToJson } from "./excelFileUploadHelper";
import { uploadJsonData } from "../Apis/excel";

export const processExcelSheetBatch = async (formData) => {
  const { orderType, excelfile, university } = formData;
  const jsonConvertedStatus = await convertSheetToJson(excelfile);
  if (jsonConvertedStatus.success) {
    const { jsonData } = jsonConvertedStatus;
    const response = await sendDataInBatches(
      jsonData,
      500,
      orderType,
      university
    );
    return { ...response, orignalJson: jsonData };
  } else {
    return { success: false, message: "failed to convert the sheet to JSON" };
  }
};

const updateJsonWorkbookData = (jsonData, workbookData) => {
  workbookData.dispatched.push(...jsonData.dispatched);
  workbookData.invalid.push(...jsonData.invalid);
  workbookData.non_servicable.push(...jsonData.non_servicable);
  workbookData.duplicates.push(...jsonData.duplicates);
  workbookData.ShipRocket_Delivery.push(...jsonData.ShipRocket_Delivery);
  workbookData.IndianPost_Delivery.push(...jsonData.IndianPost_Delivery);
};

const sendDataInBatches = async (data, batchSize, orderType, university) => {
  const totalObjects = data.length;
  let startIndex = 0;
  let endIndex = batchSize;
  let isAllBatchProcessed = true;
  const JsonWorkbookData = {
    dispatched: [],
    invalid: [],
    non_servicable: [],
    duplicates: [],
    ShipRocket_Delivery: [],
    IndianPost_Delivery: [],
  };
  let fileId;
  let status={};
  while (startIndex < totalObjects) {
    const batch = data.slice(startIndex, endIndex);
    fileId = sessionStorage.getItem("fileId");
    const response = await uploadJsonData(batch, orderType, university, fileId);
    if (response.data.success) {
      updateJsonWorkbookData(JSON.parse(response.data.data), JsonWorkbookData);
      startIndex = endIndex;
      endIndex = endIndex + batchSize;
      !fileId && sessionStorage.setItem("fileId", response.data.fileId);
    } else {
      status={...response.data};
      isAllBatchProcessed = false;
      console.log("failed to process the batch");
      break;
    }
  }
  fileId = sessionStorage.getItem("fileId");
  if (isAllBatchProcessed) {
    return {
      success: true,
      message: "Processed",
      jsonData: JsonWorkbookData,
      fileId,
    };
  }
  return { success: false, data:status, message: "failed to process the sheet in batches" };
};
