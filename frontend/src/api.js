import axios from "axios";

// Locally → uses http://localhost:8000
// On Vercel → uses your Render backend URL from .env.production
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const runTest = (url, num_requests, mode = "concurrent", method = "GET", body = null) =>
  axios.post(`${BASE}/test`, { url, num_requests, mode, method, body }).then(r => r.data);

export const getHistory = () =>
  axios.get(`${BASE}/history`).then(r => r.data);
