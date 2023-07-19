import axios from "axios";

export const getAllFeedbacks = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_BASE_URL}/getFeedbacks`
  );
  return response;
};

export const createFeedback = async (data) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return {
      data: { success: false, message: "Please login to provide feedback" },
    };
  }
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/feedback/add`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
