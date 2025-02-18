import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await axios.post(`${API_URL}/reset-password`, { token, newPassword });
  return response.data;
};

export default { register, login, forgotPassword, resetPassword };