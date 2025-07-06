// Pure string utility functions - no side effects

export function normalizeString(str) {
  // Handle null, undefined, or non-string values
  if (str == null) return "";
  if (typeof str !== "string") return String(str).toLowerCase().trim();
  return str.toLowerCase().trim();
}

export function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}

export function truncateString(str, maxLength, suffix = "...") {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

export function slugify(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Sequential order number generation
let orderCounter = 0;
let currentDate = "";

export function generateOrderNumber() {
  const now = new Date();
  const date = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const dateKey = `${date}-${month}`;

  // Reset counter if it's a new date
  if (dateKey !== currentDate) {
    orderCounter = 0;
    currentDate = dateKey;
  }

  // Increment counter
  orderCounter++;

  // Format: #ORD-DD-MM-001, #ORD-DD-MM-002, etc.
  const sequentialNumber = orderCounter.toString().padStart(3, "0");
  return `#ORD-${date}-${month}-${sequentialNumber}`;
}

export function generateId(prefix = "ID") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2);
  return `${prefix}-${timestamp}-${random}`;
}

export function removeSpecialChars(str, keepSpaces = true) {
  if (!str) return "";
  const pattern = keepSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
  return str.replace(pattern, "");
}

export function formatPhoneNumber(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function maskEmail(email) {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  const maskedLocal =
    local.length > 2
      ? local.charAt(0) +
        "*".repeat(local.length - 2) +
        local.charAt(local.length - 1)
      : local;
  return `${maskedLocal}@${domain}`;
}

export function extractInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .substring(0, 2);
}
