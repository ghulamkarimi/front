import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from "@reduxjs/toolkit";
import { IAppointment } from "../../interface";
import {  createAppointment, getAllsAppointment } from "../../service";
import { AppDispatch, RootState } from "../store/store";
import { socket } from "../../service";


interface AppointmentState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const appointmentAdapter = createEntityAdapter<IAppointment, string>({
    selectId: (appointment) => appointment._id || "",
})

const initialState: AppointmentState & EntityState<IAppointment,string> =
    appointmentAdapter.getInitialState({
        status: 'idle',
        error: null,
    })

export const fetchAppointments = createAsyncThunk("appointments/fetchAppointments", async () => {
    try {
        const response  = await getAllsAppointment();
        return response.data;
    } catch (error:any) {
        return error?.response?.data?.message || "Error fetching appointments"; 
        
    }
})

export const createAppointmentApi = createAsyncThunk("appointments/createAppointmentApi", async (appointment: IAppointment) => {
    try {
        const response = await createAppointment(appointment);
        return response.data;
    } catch (error: any) {
        return error?.response?.data?.message || "Error creating appointment";
        
    }
});

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        appointmentCreated: appointmentAdapter.addOne,
        appointmentUpdated: appointmentAdapter.updateOne,
        appointmentDeleted: appointmentAdapter.removeOne,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAppointments.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchAppointments.fulfilled, (state, action) => {
                appointmentAdapter.setAll(state, action.payload);
                state.status = 'succeeded';
            })
            .addCase(fetchAppointments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message as string || "Error fetching appointments";
            })
            .addCase(createAppointmentApi.fulfilled, (state, action) => {
                appointmentAdapter.addOne(state, action.payload);
                
            })
    }
})

export const { appointmentCreated, appointmentUpdated, appointmentDeleted } = appointmentSlice.actions;
export const{selectAll: displayAppointments,selectById: displayAppointmentById} = appointmentAdapter.getSelectors<RootState>((state)=>state.appointments);
export default appointmentSlice.reducer;

export const subscribeToSocketEvents = (dispatch: AppDispatch) => {
    socket.on('appointmentCreated', (appointment: IAppointment) => {
        dispatch(appointmentCreated(appointment));
    });

    socket.on('appointmentUpdated', (appointment: IAppointment) => {
        dispatch(appointmentUpdated({ id: appointment._id, changes: appointment }));
    });

    socket.on('appointmentDeleted', (appointmentId: string) => {
        dispatch(appointmentDeleted(appointmentId));
    });
}

