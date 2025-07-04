// Pure validation functions - no side effects

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return {
    isValid:
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers,
    errors: {
      length:
        password.length < minLength
          ? "Password must be at least 6 characters"
          : null,
      uppercase: !hasUpperCase
        ? "Password must contain at least one uppercase letter"
        : null,
      lowercase: !hasLowerCase
        ? "Password must contain at least one lowercase letter"
        : null,
      numbers: !hasNumbers ? "Password must contain at least one number" : null,
    },
  };
}

export function validatePhoneNumber(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

export function validatePrice(price) {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
}

export function validateQuantity(quantity) {
  const numQuantity = Number(quantity);
  return (
    !isNaN(numQuantity) && numQuantity > 0 && Number.isInteger(numQuantity)
  );
}

export function validateDiscount(discount) {
  const numDiscount = Number(discount);
  return !isNaN(numDiscount) && numDiscount >= 0 && numDiscount <= 100;
}

export function validateRequired(value) {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
}

export function validateStringLength(value, min = 0, max = Infinity) {
  const length = value?.toString().length || 0;
  return length >= min && length <= max;
}

export function validateName(name) {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
}
