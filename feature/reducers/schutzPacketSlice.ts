import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { ISchutzPacket } from "../../interface";
import {  allSchutzPacket } from "../../service";
import { RootState } from "../store/store";

interface ISchutzPacketSate {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  schutzPacketId:string | null ;
  
}

const schutzPacketAdapter = createEntityAdapter<ISchutzPacket, string>({
  selectId: (schutzPacket) => schutzPacket._id,
});

const initialState: ISchutzPacketSate & EntityState<ISchutzPacket, string> =
  schutzPacketAdapter.getInitialState({
    status: "idle",
    error: null,
    schutzPacketId:"",
  });



export const fetchAllSchutzPacketApi = createAsyncThunk("/schutzPacket/fetchAllSchutzPacketApi",async()=>{
    const response = await allSchutzPacket()
    console.log("responseAdel",response)
    return response.data
})

  const schutzPacketSlice = createSlice({
    name:"schutzPacket",
    initialState,
    reducers:{
      setSchutzPacketId:(state,action)=>{
        state.schutzPacketId = action.payload
      }
    },
    extraReducers(builder) {
        builder.addCase(fetchAllSchutzPacketApi.pending,(state)=>{
            state.status = "loading"
        })
        builder.addCase(fetchAllSchutzPacketApi.fulfilled,(state,action)=>{
            state.status = "succeeded"
            schutzPacketAdapter.setAll(state,action.payload.schutzPacket)
        })
        builder.addCase(fetchAllSchutzPacketApi.rejected,(state,action)=>{
            state.status = "failed"
            state.error = action.error.message || "error is accourded"
        })
    },
  })


 export  const {setSchutzPacketId} = schutzPacketSlice.actions
export const {selectAll:getAllSchutzPacket,selectById:getSchutzPacketById} = schutzPacketAdapter.getSelectors((state:RootState)=>state.schutzPacket)



  export default schutzPacketSlice.reducer