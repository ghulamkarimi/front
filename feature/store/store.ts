import { configureStore } from "@reduxjs/toolkit";
import userReducer, { fetchUsers, setToken } from "../reducers/userSlice";
import appReducer from "../reducers/appSlice";
import offerReducer, { fetchOffers } from "../reducers/offerSlice";
import appointmentReducer ,{fetchAppointments} from "../reducers/appointmentSlice";
import reservationSlice, { getReservationApi } from "../reducers/reservationSlice"
import carBuyReducer, { fetchCarBuys } from "../reducers/carBuySlice";
import schutzPacket, { fetchAllSchutzPacketApi } from "../reducers/schutzPacketSlice"
import carRentReducer, { getRentCarApi } from "../reducers/carRentSlice"
import axiosJWT from "../../service/axiosJwt";
import jwtDecode from "jwt-decode";
import { refreshToken } from '../../service/index';


interface DecodedToken {
  exp: number;
  [key: string]: any;
}


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


axiosJWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date().getTime();
    const exp = localStorage.getItem("exp");

    if (exp && Number(exp) * 1000 < currentDate) {
      const response = await refreshToken();
      console.log("Token refreshed", response.data.accessToken);

      config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      console.log("Token refreshed header", response.data.accessToken);
      const decodedToken = jwtDecode<DecodedToken>(response.data.accessToken);
      localStorage.setItem("exp", decodedToken.exp.toString());
    }

    return config;
  },
  (error) => Promise.reject(error)
);

store.dispatch(fetchUsers());
store.dispatch(getRentCarApi())
store.dispatch(fetchCarBuys());
store.dispatch(fetchOffers());
store.dispatch(fetchAllSchutzPacketApi())
store.dispatch(fetchAppointments())
store.dispatch(getReservationApi())


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
