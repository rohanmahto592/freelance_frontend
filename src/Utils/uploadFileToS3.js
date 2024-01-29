import axios from 'axios';
import { putObjectUrl } from './awsS3Utils';
const { Chance } = require("chance");
const chance = new Chance();
export const uploadFileToAwsS3 = async (formData,data, location, type) => {
    const date = new Date();

    const excelFileName =
      type === "excel" && formData.excelfile.name?.split(".")[0];

    let filePath =
      type === "excel"
        ? `${type}/${location}/${excelFileName}-${date}${chance.string({
            length: 12,
          })}.json`
        : `docFile/${date}-${formData.docfile.name}`;

    const fileUrl = await putObjectUrl(filePath);

    await axios.put(fileUrl, data);

    return filePath;
  };
