import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axiosConfig"

// Thunk pour récupérer toutes les commandes
export const fetchOrdersWithDetails = createAsyncThunk(
  "orders/fetchOrdersWithDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:5000/api/orders/all-orders-details"
      )
      return response.data // Retourne les données formatées
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Slice Redux
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [], // Toutes les commandes
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [] // Réinitialise les commandes
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersWithDetails.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchOrdersWithDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.orders = action.payload // Met à jour les commandes
      })
      .addCase(fetchOrdersWithDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload // Enregistre l'erreur
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
