function validatePassword(password) {
  let error = "";

  if (password.length === 0) {
    return error;
  }

  // Check for minimum length
  if (password.length < 8) {
    error = "Password must be at least 8 characters long";
  }

  // Check for maximum length
  else if (password.length > 20) {
    error = "Password must be at most 50 characters long";
  }

  // Check for uppercase letters
  else if (!/[A-Z]/.test(password)) {
    error = "Password must contain at least one uppercase letter";
  }

  // Check for lowercase letters
  else if (!/[a-z]/.test(password)) {
    error = "Password must contain at least one lowercase letter";
  }

  // Check for numbers
  else if (!/[0-9]/.test(password)) {
    error = "Password must contain at least one number";
  }

  // Check for special characters
  else if (!/[$@!%*?&]/.test(password)) {
    error = "Password must contain at least one special character ($@!%*?&)";
  }

  // Return errors array
  return error;
}

module.exports = { validatePassword };
