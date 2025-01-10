import { createSlice } from "@reduxjs/toolkit";
import { string } from "yup";

interface IAppState {
  isMenuOpen: boolean;
  gesamteSchutzInfo: {
    name: string;
    deductible: number;
    gesamtPrice:number
    dailyRate: number;
    features: string[];
  };
}

const initialState: IAppState = {
  isMenuOpen: false,
  gesamteSchutzInfo: {
    name: "",
    gesamtPrice:0,
    deductible: 0,
    dailyRate: 0,
    features: [""]
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsMenuOpen(state, action) {
      state.isMenuOpen = action.payload;
    },
    setGesamtSchutzInfo(state, action) {
      state.gesamteSchutzInfo = action.payload;
    },
  },
});

export const { setIsMenuOpen, setGesamtSchutzInfo } = appSlice.actions;
export default appSlice.reducer;