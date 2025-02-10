import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityState,
    PayloadAction,
} from "@reduxjs/toolkit";
import { userLogin, userRegister, getAllUsers, userLogout, profilePhotoUpload, requestPasswordReset, confirmEmailVerificationCode, checkAccessToken } from '../../service/index';
import { RootState } from "../store/store";
import { IUser, IUserInfo, TUser } from "../../interface";
import { IChangePassword } from "../../interface";
import { changePasswordWithEmail } from "../../service/index";



interface IUserState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string;
    userId: string;
    file: File | null;
    userInfo: IUserInfo;
    message?: string;

}

const userAdapter = createEntityAdapter<IUser, string>({
    selectId: (user) => (user?._id ? user._id : ""),
});


export const userRegisterApi = createAsyncThunk(
    "users/userRegisterApi",
    async (initialUser: TUser, { rejectWithValue }) => {
        try {
            const response = await userRegister(initialUser);
            if (response.status === 201) {
                return response.data;
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Error in user registration";
            return rejectWithValue(errorMessage);
        }
    }
);

export const userLoginApi = createAsyncThunk(
    "users/userLoginApi",
    async (initialUser: TUser,) => {
        try {
            const response = await userLogin(initialUser)
            localStorage.setItem("userId", response.data.userInfo.userId);
            localStorage.setItem("exp", response.data.userInfo.exp.toString());
            return response.data;
        } catch (error: any) {
            return (error?.response?.data?.message || "Error in user login");
        }
    }
);

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
    try {
        const response = await getAllUsers();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error?.response?.data?.message || "Error fetching users");
    }
});

export const userLogoutApi = createAsyncThunk("users/userLogoutApi", async (_, { rejectWithValue }) => {
    try {
        const response = await userLogout();
        localStorage.clear();
        return response.data;
    } catch (error) {

        const errorMessage = (error as any)?.response?.data?.message || "Logout failed";
        return rejectWithValue(errorMessage);
    }
});

export const profilePhotoUploadApi = createAsyncThunk(
    "users/profilePhotoUploadApi",
    async (data: File, { rejectWithValue }) => {
        try {
            const response = await profilePhotoUpload(data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message || "Fehler beim Hochladen des Profilbilds");
        }
    }
);
export const changePasswordApi = createAsyncThunk(
    "user/changePassword",
    async (passwordData: IChangePassword, { rejectWithValue }) => {
        try {
            const response = await changePasswordWithEmail(passwordData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Fehler beim Ändern des Passworts");
        }
    }
);



export const checkAccessTokenApi = createAsyncThunk(
    "/user/checkRefreshTokenApi",
    async () => {
        try {
            const response = await checkAccessToken();
            localStorage.setItem("userId", response.data.user._id); // Benutzer-ID speichern
            return response.data;
        } catch (error: any) {
            // if (error.response.status === 401 || error.response.status === 404) {
            //   localStorage.clear(); // Lokalen Speicher löschen bei ungültigem Token
            // }
            throw error.response.data.message;
        }
    }
);

export const requestPasswordResetApi = createAsyncThunk(
    "user/requestPasswordResetApi",
    async (email: string, { rejectWithValue }) => {

        try {
            const response = await requestPasswordReset(email);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data.message || "Fehler beim Zurücksetzen des Passworts");
        }
    }
)

export const confirmEmailVerificationCodeApi = createAsyncThunk(
    "user/confirmEmailVerificationCode",
    async (
        { email, verificationCode }: { email: string; verificationCode: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await confirmEmailVerificationCode(email, verificationCode);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Fehler beim Bestätigen des Verifizierungscodes."
            );
        }
    }
);

const initialState: IUserState & EntityState<IUser, string> =
    userAdapter.getInitialState({
        status: "idle",
        error: null,
        file: null,
        userId: "",
        token: "",
        userInfo: {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            profile_photo: "",
            password: "",
            confirmPassword: "",
            isAdmin: false,
            customerNumber: "",
            exp: 0,
            iat: 0,
        },
    });

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        clearUserInfos: (state) => {
            state.userInfo = initialState.userInfo;
            state.token = "";
            state.userId = "";
        },
        // Benutzer aktualisieren
        userUpdated: (state, action: PayloadAction<{ id: string; updatedUser: IUser }>) => {
            const { id, updatedUser } = action.payload;
            userAdapter.updateOne(state, {
                id,
                changes: updatedUser,
            });
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(userRegisterApi.pending, (state) => {
                state.status = "loading";
            })
            .addCase(userRegisterApi.fulfilled, (state, action) => {
                userAdapter.addOne(state, action.payload.user);
                state.status = "succeeded";
            })
            .addCase(userLoginApi.fulfilled, (state, action) => {
                userAdapter.setOne(state, action.payload.user);
                state.status = "succeeded";
            })
            .addCase(userLogoutApi.fulfilled, () => {
                return initialState;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                userAdapter.setAll(state, action.payload);
                state.status = "succeeded";
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch users";
            })

            .addCase(profilePhotoUploadApi.fulfilled, (state, action) => {
                if (action.payload?.userInfo) {
                    userAdapter.setOne(state, action.payload.userInfo);
                    state.status = "succeeded";
                } else {
                    state.status = "failed";
                    state.error = "Benutzerinformationen fehlen";
                    console.error("Payload enthält keine Benutzerinformationen:", action.payload);
                }
            })
            .addCase(changePasswordApi.fulfilled, (state) => {
                state.status = "succeeded";
                state.error = null;
            })

            .addCase(requestPasswordResetApi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
            })
            .addCase(checkAccessTokenApi.fulfilled, (state, action) => {
                userAdapter.setOne(state, action.payload.userInfo);

            })
            .addCase(checkAccessTokenApi.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Token check failed";
            })
            .addCase(confirmEmailVerificationCodeApi.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.message = action.payload.message;
                if (action.payload.user) {
                    state.userInfo = {
                        ...state.userInfo,
                        email: action.payload.user.email,
                        isAccountVerified: action.payload.user.isAccountVerified,
                    };
                }
            });
    }
});
export const { userUpdated, clearUserInfos, setUserId } = userSlice.actions;
export const { selectAll: displayUsers, selectById: displayUserById } = userAdapter.getSelectors((state: RootState) => state.users);
export const { setToken, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
