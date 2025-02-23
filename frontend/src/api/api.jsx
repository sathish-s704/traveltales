import axios from "axios";

const API_BASE = "http://localhost:3000/api/admin"; // Backend URL

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // ✅ Required for refresh token in cookies
  });
  


// Admin Signin
export const adminSignin = async (email, password) => {
    try {
        const response = await axios.post(`${API_BASE}/signin`, { email, password });
        return response.data; // Return token
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Signin failed" };
    }
};


// Fetch Users (Admin CRUD)
export const getUsers = async (token) => {
    try {
        const response = await axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Unauthorized" };
    }
};

// Create User
export const createUser = async (userData, token) => {
    console.log("Sending Token:", token); // ✅ Debugging Step

    try {
        const response = await axios.post("http://localhost:3000/api/admin/create-users", userData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // ✅ Ensures cookies are sent
        });

        return response.data;
    } catch (error) {
        console.error("Create User Error:", error.response?.data || error);
        return { success: false, message: "Failed to create user" };
    }
};



// Update User
export const updateUser = async (userId, userData, token) => {
    try {
        const response = await axios.put(`${API_BASE}/users/${userId}`, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error updating user" };
    }
};

// Delete User
export const deleteUser = async (userId, token) => {
    try {
        const response = await axios.delete(`${API_BASE}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Error deleting user" };
    }
};



const refreshAccessToken = async () => {
  try {
      console.log("Refreshing access token...");
      const res = await axios.get(`${API_BASE}/refresh-token`, { withCredentials: true });

      if (res.data.success && res.data.accessToken) {
          console.log("New token received:", res.data.accessToken);
          
          // ✅ Update token in Cookies
          Cookies.set("token", res.data.accessToken, { sameSite: "Strict", secure: true });

          // ✅ Update Axios default headers
          api.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;

          return res.data.accessToken;
      }
  } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
  }
};

api.interceptors.request.use(async (config) => {
  let token = getToken();

  // Check if token is missing or expired
  if (!token || isTokenExpired(token)) {
      console.warn("Token expired, attempting to refresh...");
      token = await refreshAccessToken(); // Wait for new token

      if (!token) {
          console.error("Refresh failed, forcing logout...");
          Cookies.remove("token");
          window.location.href = "/login";
          return Promise.reject("Session expired, please log in again");
      }
  }

  // ✅ Ensure updated token is used
  config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
      if (error.response?.status === 401) { // 🛑 Token expired
          console.warn("401 Unauthorized - Refreshing token...");
          const newToken = await refreshAccessToken();

          if (newToken) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return api.request(error.config); // ✅ Retry failed request
          }

          console.error("Token refresh failed, logging out...");
          Cookies.remove("token");
          window.location.href = "/login";
      }
      return Promise.reject(error);
  }
);


  export default api;