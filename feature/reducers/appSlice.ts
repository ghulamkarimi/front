
import { createSlice } from "@reduxjs/toolkit";

interface IAppState {
    isMenuOpen: boolean;
}

const initialState: IAppState = {
    isMenuOpen: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsMenuOpen(state, action) {
            state.isMenuOpen = action.payload;
        },
    },
});

export const { setIsMenuOpen } = appSlice.actions;
export default appSlice.reducer;
