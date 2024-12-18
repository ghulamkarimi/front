import { configureStore } from "@reduxjs/toolkit";
import userReducer, { fetchUsers} from "../reducers/userSlice";
import appReducer from "../reducers/appSlice";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import appointmentReducer, { fetchAppointments } from "../reducers/appointmentSlice";
import reservationSlice, { getReservationApi } from "../reducers/reservationSlice"
import carBuyReducer, { fetchCarBuys } from "../reducers/carBuySlice";
import schutzPacket, { fetchAllSchutzPacketApi } from "../reducers/schutzPacketSlice"
import carRentReducer, { getRentCarApi } from "../reducers/carRentSlice"
import jwtDecode from "jwt-decode";
import { refreshToken } from '../../service/index';
import axios from "axios";






export const store = configureStore({
  reducer: {
    users: userReducer,
    app: appReducer,
    carRent: carRentReducer,
    carBuys: carBuyReducer,
    offer: offerReducer,
    appointments: appointmentReducer,
    schutzPacket: schutzPacket,
    reservation: reservationSlice

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})




interface DecodedToken {
  exp: number;
  [key: string]: any;
}

let isRefreshing = false;
let failedQueue: any[] = [];


const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};


const axiosJWT = axios.create({
  baseURL: "http://localhost:7001", // Adjust base URL as needed
  withCredentials: true,
});

axiosJWT.interceptors.request.use(
  async (config) => {
    try {
      const exp = localStorage.getItem("exp");

      if (exp && Number(exp) * 1000 < Date.now()) {
        // Token has expired
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const response = await refreshToken();
            const newAccessToken = response.data.accessToken;

            console.log("Token successfully refreshed:", newAccessToken);

            // Decode and store the new token expiration time
            const decodedToken = jwtDecode<DecodedToken>(newAccessToken);
            localStorage.setItem("exp", decodedToken.exp.toString());

            // Update Authorization header for the current request
            config.headers.Authorization = `Bearer ${newAccessToken}`;

            // Process the queue with the new token
            processQueue(null, newAccessToken);
          } catch (error) {
            console.error("Error refreshing token:", error);

            // Clear storage and redirect to login
            localStorage.removeItem("exp");
            localStorage.removeItem("userId");
            window.location.href = "/login";

            // Reject all requests in the queue
            processQueue(error, null);
            throw error;
          } finally {
            isRefreshing = false;
          }
        } else {
          // If a refresh is already in progress, add the request to the queue
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                config.headers.Authorization = `Bearer ${token}`;
                resolve(config);
              },
              reject: (err: any) => reject(err),
            });
          });
        }
      }

      return config;
    } catch (error) {
      console.error("Error in request interceptor:", error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);


axiosJWT.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized request detected. Redirecting to login...");
      localStorage.removeItem("exp");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);




Promise.all([
  store.dispatch(fetchUsers()),
  store.dispatch(getRentCarApi()),
  store.dispatch(fetchCarBuys()),
  store.dispatch(fetchOffers()),
  store.dispatch(fetchAllSchutzPacketApi()),
  store.dispatch(fetchAppointments()),
  store.dispatch(getReservationApi()),
]).then(() => {
  console.log("Alle Daten erfolgreich geladen");
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
