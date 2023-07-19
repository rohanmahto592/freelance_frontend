import axios from "axios";
export const signup = async (userData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/signup`,
    userData
  );

  return response;
};

export const login = async (userData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/login`,
    userData
  );
  return response;
};
