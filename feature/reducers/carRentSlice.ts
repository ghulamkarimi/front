import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from "@reduxjs/toolkit";
import { ICarRent } from "../../interface";
import { createPayPalOrder, getCarRent, getOneCarById } from "../../service";
import { RootState } from "../store/store";


export interface ICarRentState {
  orderDetails: { amount: string; customerEmail: string; carId: string; userId: string } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  carId: string | null;
  selectedSchutzPacket: "Basic" |"Medium"|"Premium";
  totalPrice: number;
  isCarVerfügbar: boolean;
  isDetailsSchutzPacketActive: boolean;
 
  loading:boolean
  rentalDays: number;
  pickupDate: string | null;
  pickupTime: string | null;
  returnDate: string | null;
  returnTime: string | null;
  pickupLocation: string | null;
  age: string | null;
}

const carRentAdapter = createEntityAdapter<ICarRent, string>({
  selectId: (car) => car._id || "",
});

const initialState: ICarRentState & EntityState<ICarRent, string> =
  carRentAdapter.getInitialState({
    status: "idle",
    error: null,
    totalPrice: 0,
    isCarVerfügbar: false,
    carId: "",
    isDetailsSchutzPacketActive: false,
  
    loading:false,
    selectedSchutzPacket: "Basic",
    rentalDays: 0,
    pickupDate: null,
    pickupTime: null,
    returnDate: null,
    returnTime: null,
    pickupLocation: null,
    orderDetails: null,
    age: null,
  });

export const getRentCarApi = createAsyncThunk(
  "carRent/getRentCar",
  async () => {
    try {
      const response = await getCarRent();
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const getCarRentByIdApi = createAsyncThunk(
  "carRent/getCarRentByIdApi",
  async (id: string) => {
    try {
      const response = await getOneCarById(id);
      return response.data;
    } catch (error: any) {
      return error.message;
    }
  }
);

export const createPayPalOrderApi = createAsyncThunk< 

  { amount: string; customerEmail: string; carId: string; userId: string } 
 
>(
  'carRent/paypalPayment',
  async (orderDetails) => {
    try {
      const response = await createPayPalOrder(orderDetails);
      return response; 
    } catch (error:any) {
      return (error.response?.data || 'Unbekannter Fehler');
    }
  }
);

const carRentSlice = createSlice({
  name: "carRent",
  initialState,
  reducers: {
    setCarId: (state, action) => {
      state.carId = action.payload;
    },
    setRentalDetails: (state, action) => {
      const {
        rentalDays,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        pickupLocation,
        age,
      } = action.payload;
      state.rentalDays = action.payload.rentalDays ?? state.rentalDays;
      state.pickupDate = action.payload.pickupDate ?? state.pickupDate;
      state.pickupTime = action.payload.pickupTime ?? state.pickupTime;
      state.returnDate = action.payload.returnDate ?? state.returnDate;
      state.returnTime = action.payload.returnTime ?? state.returnTime;
      state.pickupLocation = action.payload.pickupLocation ?? state.pickupLocation;
      state.age = action.payload.age ?? state.age;
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setIsCarVerfügbar: (state, action) => {
      state.isCarVerfügbar = action.payload;
    },
    setIsDetailsSchutzPacketActive: (state, action) => {
      state.isDetailsSchutzPacketActive = action.payload;
    },
   
    setSelectedSchutzPackage: (state, action) => {
      state.selectedSchutzPacket = action.payload;
    },
    setIsLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRentCarApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getRentCarApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        carRentAdapter.setAll(state, action.payload);
      })
      .addCase(getRentCarApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "failed to get all car";
      })
      .addCase(getCarRentByIdApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCarRentByIdApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        carRentAdapter.setOne(state, action.payload);
      })
      .addCase(getCarRentByIdApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "failed to get all car";
      })

      .addCase(createPayPalOrderApi.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPayPalOrderApi.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orderDetails = action.payload;
      })
      .addCase(createPayPalOrderApi.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "failed to Order "
      });
  },
});

export const {
  setTotalPrice,
  setIsCarVerfügbar,
  setCarId,
  setIsDetailsSchutzPacketActive,
  setSelectedSchutzPackage,
  setRentalDetails,
  setIsLoading
} = carRentSlice.actions;

export const { selectAll: getAllRentCars, selectById: getRentCarById } =
  carRentAdapter.getSelectors((state: RootState) => state.carRent);

export default carRentSlice.reducer;