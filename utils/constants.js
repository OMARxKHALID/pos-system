// Application constants - no side effects

// Tax rates
export const TAX_RATE = 0.1; // 10%

// Order statuses
export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
};

// Menu categories
export const MENU_CATEGORIES = {
  APPETIZER: "appetizer",
  MAIN: "main",
  DESSERT: "dessert",
  BEVERAGE: "beverage",
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  DIGITAL: "digital",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Validation limits
export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  PRICE_MIN: 0.01,
  QUANTITY_MIN: 1,
  DISCOUNT_MIN: 0,
  DISCOUNT_MAX: 100,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  INPUT: "yyyy-MM-dd",
  TIME: "HH:mm",
};

// Currency
export const CURRENCY = {
  CODE: "USD",
  SYMBOL: "$",
  LOCALE: "en-US",
};

// File upload limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
};
