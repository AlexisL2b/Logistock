import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axiosConfig"
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorage"

// 🔹 Fonction pour récupérer le profil utilisateur depuis l'API
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || getFromLocalStorage("authToken")
      if (!token) throw new Error("Token manquant")

      const response = await axiosInstance.get("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  user: getFromLocalStorage("user") || null,
  token: getFromLocalStorage("authToken") || null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.token = action.payload.token
      saveToLocalStorage("user", action.payload)
      saveToLocalStorage("authToken", action.payload.token)
    },
    logoutUser: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("user")
      localStorage.removeItem("authToken")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        saveToLocalStorage("user", action.payload)
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer
