import axios from "axios";

export const contactUs = async (userData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/add/contact`,
    userData
  );
  return response;
};
