import axios from "axios";

const axiosJWT = axios.create({
  baseURL: "https://car-db.ghulam-dev.me",
  withCredentials: true,
});
axiosJWT.interceptors.request.use;

export default axiosJWT;
