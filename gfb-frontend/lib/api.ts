import axios from "axios";

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 500000,
  withCredentials: true,
});

export default api;
