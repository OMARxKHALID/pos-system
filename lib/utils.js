// Configuration utilities for styling and UI

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Environment configuration
export function getEnvironment() {
  return process.env.NODE_ENV || "development";
}

export function isDevelopment() {
  return getEnvironment() === "development";
}

export function isProduction() {
  return getEnvironment() === "production";
}

// API configuration
export function getApiUrl() {
  if (isProduction()) {
    return process.env.NEXT_PUBLIC_API_URL || "https://your-domain.com/api";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
}

// Database configuration
export function getDatabaseConfig() {
  return {
    uri: process.env.MONGODB_URI,
    options: {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  };
}
