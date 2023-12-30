import axios from "axios";

export const contactUs = async (userData) => {
  const response = await axios.post(
    `${process.env.REACT_APP_BASE_URL}/add/contact`,
    userData
  );
  return response;
};
export const sendForgotPasswordLink=async(email)=>{
 const response=await axios.post( `${process.env.REACT_APP_BASE_URL}/user/forgot-password`,{email});
 return response;
}
export const resetPassword=async(email,otp,password,token)=>{
  const response=await axios.post( `${process.env.REACT_APP_BASE_URL}/user/reset-password`,{email:email,otp:otp,password:password,token});
 return response;
}