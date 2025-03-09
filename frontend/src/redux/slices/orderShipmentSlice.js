import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getOrderShipments,
  getOrderShipmentById,
  addOrderShipment,
  updateOrderShipment,
  deleteOrderShipment,
} from "../api/orderShipmentApi"

// Thunk pour récupérer tous les départs de commande
export const fetchOrderShipments = createAsyncThunk(
  "orderShipments/fetchOrderShipments",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrderShipments()
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

// Thunk pour récupérer un départ de commande par ID
export const fetchOrderShipmentById = createAsyncThunk(
  "orderShipments/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await getOrderShipmentById(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

// Thunk pour ajouter un départ de commande
export const createOrderShipment = createAsyncThunk(
  "orderShipments/create",
  async (newOrderShipment, { rejectWithValue }) => {
    try {
      return await addOrderShipment(newOrderShipment)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

// Thunk pour mettre à jour un départ de commande
export const modifyOrderShipment = createAsyncThunk(
  "orderShipments/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateOrderShipment(id, data)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

// Thunk pour supprimer un départ de commande
export const removeOrderShipment = createAsyncThunk(
  "orderShipments/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteOrderShipment(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue")
    }
  }
)

const orderShipmentSlice = createSlice({
  name: "orderShipments",
  initialState: {
    list: [],
    loading: false,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderShipments.pending, (state) => {
        state.loading = true
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchOrderShipments.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchOrderShipments.rejected, (state, action) => {
        state.status = "rejected"
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrderShipmentById.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      })
      .addCase(createOrderShipment.fulfilled, (state, action) => {
        // state.items.push(action.payload)
      })
      .addCase(modifyOrderShipment.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        )
      })
      .addCase(removeOrderShipment.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id
        )
      })
  },
})

export default orderShipmentSlice.reducer
