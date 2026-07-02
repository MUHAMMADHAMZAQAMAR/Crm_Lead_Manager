import axios from "axios";

// One shared axios instance for the whole app, instead of importing
// plain axios everywhere and repeating the base URL and headers.
const api = axios.create({
  // In production (Vercel), VITE_API_URL points to the live Render backend.
  // In local dev it falls back to /api which goes through the Vite proxy.
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// An axios "interceptor" runs on every outgoing request before it's
// sent. We use it to attach the saved JWT automatically, so individual
// components never have to remember to do this themselves.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
