import axios from "axios";

const axiosJWT = axios.create({
  // baseURL: "https://car-db.ghulam-dev.me",
  baseURL: "http://localhost:7001",
  withCredentials: true,
});
axiosJWT.interceptors.request.use;

export default axiosJWT;
