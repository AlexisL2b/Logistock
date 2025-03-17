import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getSalesPoint, getSalesPointsWithoutUsers } from "../api/salesPointApi"

// 🔹 Thunk pour récupérer tous les points de vente
export const fetchSalesPoints = createAsyncThunk(
  "salesPoints/fetchSalesPoints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSalesPoint()
      return response
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des points de vente :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// ✅ 🔹 Thunk pour récupérer les points de vente sans utilisateur
export const fetchSalesPointsWithoutUsers = createAsyncThunk(
  "salesPoints/fetchSalesPointsWithoutUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSalesPointsWithoutUsers()
      return response
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des points de vente sans utilisateur :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const salesPointSlice = createSlice({
  name: "salesPoints",
  initialState: {
    list: [],
    withoutUsers: [], // ✅ Ajout d'un état pour les salesPoints sans utilisateur
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesPoints.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesPoints.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchSalesPoints.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      // ✅ Gestion des points de vente sans utilisateur
      .addCase(fetchSalesPointsWithoutUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesPointsWithoutUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.withoutUsers = action.payload // ✅ Stocker les salesPoints sans utilisateur
      })
      .addCase(fetchSalesPointsWithoutUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export default salesPointSlice.reducer
