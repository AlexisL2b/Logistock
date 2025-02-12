import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axiosConfig"

// 🔹 Fonction pour récupérer le profil utilisateur depuis l'API
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      console.log(
        "🔹 Envoi de la requête pour récupérer le profil utilisateur..."
      )
      const response = await axiosInstance.get("/users/profile", {
        withCredentials: true,
      })
      console.log("✅ Profil utilisateur récupéré :", response.data)
      return response.data.user
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération du profil :",
        error.response?.data?.message || error.message
      )
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const initialState = {
  user: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = null
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
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer
