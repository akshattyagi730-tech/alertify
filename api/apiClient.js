const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// Simple request helper
const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

const apiClient = {
  // ---------------- AUTH (optional for now) ----------------
  auth: {
    me: async () => ({ email: "test@gmail.com" }), // temp
  },

  // ---------------- CONTACTS ----------------
  entities: {
    TrustedContact: {
      list: async (created_by) => {
        return request(`/contacts?created_by=${created_by}`);
      },

      create: async (data) => {
        return request(`/contacts`, {
          method: "POST",
          body: data,
        });
      },

      delete: async (id) => {
        return request(`/contacts/${id}`, {
          method: "DELETE",
        });
      },
    },
  },

  // ---------------- SOS ----------------
  functions: {
    StartSOS: async (data) => {
      return request(`/sos/start`, {
        method: "POST",
        body: data,
      });
    },
  },
};

export default apiClient;
