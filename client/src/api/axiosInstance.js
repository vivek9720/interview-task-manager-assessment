import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("itm_user");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
