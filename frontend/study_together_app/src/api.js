import axios from "axios";

const api = axios.create({
  baseURL: "https://study-together-app-1.onrender.com/api",
});

// ✅ Attach JWT to every request
api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

export const registerUser = (user) =>
  api.post("/auth/register", user);

export const loginUser = (user) =>
  api.post("/auth/login", user);

export default api;