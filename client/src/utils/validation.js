// src/utils/validation.js
// Email validation
export const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Password validation - minimum 6 characters
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Phone number validation
export const isValidPhone = (phone) => {
  const re =
    /^\+?([0-9]{1,3})?[-. ]?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return re.test(String(phone));
};

// Name validation - minimum 2 characters, only letters and spaces
export const isValidName = (name) => {
  return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

// Validate required fields in a form
export const validateForm = (formData, requiredFields) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === "") {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
  });

  if (formData.email && !isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (formData.password && !isValidPassword(formData.password)) {
    errors.password = "Password must be at least 6 characters";
  }

  if (formData.phone && !isValidPhone(formData.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  if (formData.name && !isValidName(formData.name)) {
    errors.name = "Name should only contain letters and spaces";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
