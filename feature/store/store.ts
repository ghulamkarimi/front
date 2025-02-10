import { configureStore } from "@reduxjs/toolkit";
import userReducer, {  checkAccessTokenApi, fetchUsers, setToken} from "../reducers/userSlice";
import appReducer from "../reducers/appSlice";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import appointmentReducer, { fetchAppointments } from "../reducers/appointmentSlice";
import reservationSlice, { getReservationApi } from "../reducers/reservationSlice"
import carBuyReducer, { fetchCarBuys } from "../reducers/carBuySlice";
import schutzPacket, { fetchAllSchutzPacketApi } from "../reducers/schutzPacketSlice"
import carRentReducer, { getRentCarApi } from "../reducers/carRentSlice"
import { refreshToken } from "../../service";
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
    reservation: reservationSlice

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const exp = localStorage.getItem("exp");
    if (Number(exp) * 1000 > currentDate.getDate()) {
      const response = await refreshToken();
      config.headers.Authorization = `Bearer ${response.data.refreshToken}`;
      store.dispatch(setToken(response.data.refreshToken));
      // store.dispatch(setUserInfoRefresh(response.data.userInfo_refresh));
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
  store.dispatch(checkAccessTokenApi())
])
  .then(() => {
    console.log("Alle API-Aufrufe erfolgreich abgeschlossen.");
    // Weiterer Code hier
  })
  .catch((error) => {
    console.error("Fehler bei einem der API-Aufrufe:", error);
  });




export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;