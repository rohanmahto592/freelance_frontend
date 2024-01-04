export const validateEmail = (email) => {
  let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/i;
  return regex.test(email);
};
