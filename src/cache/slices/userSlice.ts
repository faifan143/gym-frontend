/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/utils/axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store";

interface UserState {
  accessToken: string | null;
  id: number | null;
  name: string | null;
  email: string | null;
  photo: string | null;
  role: "MANAGER" | "TRAINER" | "NUTRITIONIST" | "CUSTOMER" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  email: null,
  id: null,
  role: null,
  photo: null,
  accessToken: null,
  status: "idle",
  name: null,
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      console.log("response : ", response);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.email = null;
      state.id = null;
      state.role = null;
      state.name = null;
      state.accessToken = null;
      Cookies.remove("access_token");
      localStorage.removeItem("persist:user");
    },
    setStatus: (state, actions) => {
      state.status = actions.payload;
    },
    setSliceName: (state, actions) => {
      state.name = actions.payload;
    },
    setSlicePhoto: (state, action: PayloadAction<string>) => {
      state.photo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        // state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.email = action.payload.email;
        state.id = action.payload.id;
        state.role = action.payload.role;
        state.name = action.payload.name;
        state.accessToken = action.payload.accessToken;
        state.photo = action.payload.photo;

        Cookies.set("access_token", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload || "login failed";
      });
  },
});

export const { logout, setStatus, setSliceName, setSlicePhoto } =
  userSlice.actions;

export const selectUser = (state: RootState) => state.user.email;
export const selectAccessToken = (state: RootState) => state.user.accessToken;

export default userSlice.reducer;
