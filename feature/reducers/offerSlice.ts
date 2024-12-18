import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IOffer } from "../../interface";
import { RootState, AppDispatch } from "../store/store"; // AppDispatch importieren
import { getOffers } from "../../service";


interface OfferState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const offerAdapter = createEntityAdapter<IOffer, string>({
    selectId: (offer) => offer._id || "",
});

const initialState: OfferState & EntityState<IOffer, string> = offerAdapter.getInitialState({
    status: 'idle',
    error: null,
});

export const fetchOffers = createAsyncThunk("/offer/fetchOffers", async () => {
    try {
        const response = await getOffers();
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Error fetching offers";
    }
});

const offerSlice = createSlice({
    name: "offer",
    initialState,
    reducers: {
     
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOffers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOffers.fulfilled, (state, action) => {
                offerAdapter.setAll(state, action.payload);
                state.status = 'succeeded';
            })
            .addCase(fetchOffers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string || "Error fetching offers";
            });
    }
});

export const { selectAll: displayOffers, selectById: displayOfferById } = offerAdapter.getSelectors<RootState>((state) => state.offer);
export default offerSlice.reducer;

 