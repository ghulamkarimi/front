import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IReservation, TReservation } from "../../interface";
import { createReservation, getReservation } from "../../service";
import { RootState } from "../store/store";


export interface IReservationState{
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    reservationId:string | null
}



const reservationAdapter = createEntityAdapter<IReservation, string>({
    selectId: (reservation) => reservation?._id || "",
});

const initialState:IReservationState & EntityState<IReservation,string>=reservationAdapter.getInitialState({
     status: "idle",
     error:null,
     reservationId:""
})


export const getReservationApi = createAsyncThunk("/reservation/getReservationApi",async()=>{
try {
    const response = await getReservation()
    return response.data

} catch (error:any) {
    return error.message
}
})

export const createReservationApi = createAsyncThunk("/reservation/createReservationApi",async(
    formData:TReservation
)=>{
try {
    const response = await createReservation(formData)
    return response.data;
} catch (error:any) {
    throw error.response.data.message;
}
})

const reservationSlice = createSlice({
name:"reservation",
initialState,
reducers:{
    setReservationId:(state,action)=>{
        state.reservationId = action.payload
    }
},
extraReducers:(builder)=>{
    builder.addCase(getReservationApi.pending,(state)=>{
        state.status= "loading";
    })
    builder.addCase(getReservationApi.fulfilled,(state,action)=>{
        state.status="succeeded",
        reservationAdapter.setOne(state,action.payload.reservation)
    })
    builder.addCase(getReservationApi.rejected,(state,action)=>{
        state.status="failed",
        state.error = action.error.message || "reservation loading failed"
        
    })
}
})

export const {setReservationId} = reservationSlice.actions
export const {selectAll:AllReservation,selectById:getOneReservation} = reservationAdapter.getSelectors((state:RootState)=>state.reservation)


export default reservationSlice.reducer