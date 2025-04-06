import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use Vite env variable
  // timeout: 10000, // Optional: Set a timeout (10 seconds)
  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

export default axiosInstance;
