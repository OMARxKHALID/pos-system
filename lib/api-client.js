// Shared API client for consistent fetch patterns

const API_BASE = "/api";

// Standard fetch wrapper with error handling
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || "API request failed");
  }
}

// CRUD operations
export const apiClient = {
  // GET request
  get: (endpoint) => apiRequest(endpoint),

  // POST request
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // PUT request
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: "DELETE",
    }),

  // PUT with query parameters
  putWithId: (endpoint, id, data) =>
    apiRequest(`${endpoint}?id=${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // DELETE with query parameters
  deleteWithId: (endpoint, id) =>
    apiRequest(`${endpoint}?id=${id}`, {
      method: "DELETE",
    }),
};
