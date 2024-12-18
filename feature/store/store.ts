import { configureStore } from "@reduxjs/toolkit";
import userReducer, { fetchUsers, setToken } from "../reducers/userSlice";
import appReducer from "../reducers/appSlice";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import appointmentReducer ,{fetchAppointments} from "../reducers/appointmentSlice";
import reservationSlice, { getReservationApi } from "../reducers/reservationSlice"
import carBuyReducer, { fetchCarBuys } from "../reducers/carBuySlice";
import schutzPacket, { fetchAllSchutzPacketApi } from "../reducers/schutzPacketSlice"
import carRentReducer, { getRentCarApi } from "../reducers/carRentSlice"
import jwtDecode from "jwt-decode";
import { refreshToken } from '../../service/index';
import axiosJWT from "../../service/axiosJwt";
 





export const store = configureStore({
  reducer: {
    users: userReducer,
    app: appReducer,
    carRent: carRentReducer,
    carBuys: carBuyReducer,
    offer: offerReducer,
    appointments: appointmentReducer,
    schutzPacket: schutzPacket,
    reservation:reservationSlice

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})



interface DecodedToken {
  exp: number; // Ablaufzeit des Tokens
  [key: string]: any; // Beliebige zusätzliche Felder
}


// const axiosJWT = axios.create();

let isRefreshing = false; // Verhindert parallele Token-Refreshes
let failedQueue: any[] = []; // Warteschlange für fehlgeschlagene Anfragen während Token-Refresh

// Funktion zur Bearbeitung der Warteschlange
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};


axiosJWT.interceptors.request.use(
  async (config) => {
    const exp = localStorage.getItem("exp");

    if (exp && Number(exp) * 1000 < Date.now()) {
      // Token ist abgelaufen
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response = await refreshToken();
          const newAccessToken = response.data.accessToken;

          console.log("Token successfully refreshed:", newAccessToken);

          // Token speichern
          const decodedToken = jwtDecode<DecodedToken>(newAccessToken);
          localStorage.setItem("exp", decodedToken.exp.toString());

          // Setze neuen Token für ausstehende Anfragen
          processQueue(null, newAccessToken);

          // Aktualisiere Header
          config.headers.Authorization = `Bearer ${newAccessToken}`;
        } catch (error) {
          console.error("Error refreshing token:", error);

          // Logout bei fehlgeschlagenem Refresh
          localStorage.removeItem("exp");
          localStorage.removeItem("userId");
          window.location.href = "/login";

          processQueue(error, null);
          throw error;
        } finally {
          isRefreshing = false;
        }
      } else {
        // Wenn bereits ein Refresh läuft, warte bis er abgeschlossen ist
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
  },
  (error) => {
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
