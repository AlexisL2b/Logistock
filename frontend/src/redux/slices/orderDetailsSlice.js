import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getOrderDetailsById,
  addOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
  getOrderDetails,
} from "../api/orderDetailsApi"

// 🔥 Thunk pour récupérer toutes les commandes avec détails
export const fetchOrdersDetails = createAsyncThunk(
  "orders/fetchOrdersDetails",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrderDetails()
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour récupérer une commande par ID
export const fetchOrderDetailsById = createAsyncThunk(
  "orders/fetchOrderDetailsById",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getOrderDetailsById(orderId)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour créer une nouvelle commande
export const createOrderDetails = createAsyncThunk(
  "orders/createOrderDetails",
  async (orderData, { rejectWithValue }) => {
    try {
      return await addOrderDetails(orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour mettre à jour une commande
export const modifyOrderDetails = createAsyncThunk(
  "orders/modifyOrderDetails",
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      return await updateOrderDetails(orderId, orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour supprimer une commande
export const removeOrderDetails = createAsyncThunk(
  "orders/removeOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      await deleteOrderDetails(orderId)
      return orderId // Retourner l'ID pour l'enlever du state Redux
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const ordersDetailsSlice = createSlice({
  name: "orders",
  initialState: {
    list: [], // Toutes les commandes
    selectedOrder: null, // Commande spécifique
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.list = [] // Réinitialise les commandes
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrdersDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchOrdersDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      .addCase(fetchOrderDetailsById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrderDetailsById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderDetailsById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      .addCase(createOrderDetails.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createOrderDetails.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list.push(action.payload) // Ajoute la nouvelle commande
      })
      .addCase(createOrderDetails.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      .addCase(modifyOrderDetails.fulfilled, (state, action) => {
        const index = state.list.findIndex((o) => o._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })

      .addCase(removeOrderDetails.fulfilled, (state, action) => {
        state.list = state.list.filter((o) => o._id !== action.payload)
      })
  },
})

export const { clearOrders } = ordersDetailsSlice.actions
export default ordersDetailsSlice.reducer
