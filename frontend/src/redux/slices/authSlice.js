import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axiosConfig"

// 🔹 Récupérer le profil utilisateur
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/profile", {
        withCredentials: true,
      })
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// 🔹 Mettre à jour les infos utilisateur
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updatedFields }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/users/${userId}`,
        updatedFields,
        {
          withCredentials: true, // Assure la persistance du cookie JWT
        }
      )
      return response.data.user // Retourne uniquement l'utilisateur mis à jour
    } catch (error) {
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
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload } // Mise à jour sans toucher au token
      })
  },
})

export const { setUser, logoutUser } = authSlice.actions
export default authSlice.reducer
