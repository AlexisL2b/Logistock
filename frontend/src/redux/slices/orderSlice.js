import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getOrderById,
  addOrder,
  updateOrder,
  deleteOrder,
  getOrders,
} from "../api/orderApi"

// 🔥 Thunk pour récupérer toutes les commandes avec détails
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getOrders()
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
// 🔥 Thunk pour récupérer une commande par ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getOrderById(orderId)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
// 🔥 Thunk pour créer une nouvelle commande
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      return await addOrder(orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour mettre à jour une commande
export const modifyOrder = createAsyncThunk(
  "orders/modifyOrder",
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      console.log("orderId depuis orderSlice.js", orderId)
      console.log("orderData depuis orderSlice.js", orderData)
      return await updateOrder(orderId, orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk pour supprimer une commande
export const removeOrder = createAsyncThunk(
  "orders/removeOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await deleteOrder(orderId)
      return orderId // Retourner l'ID pour l'enlever du state Redux
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    selectedOrder: null,
    status: "idle",
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
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list.push(action.payload) // Ajoute la nouvelle commande
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(modifyOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((o) => o._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(removeOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((o) => o._id !== action.payload)
      })
  },
})

export const { clearOrders } = ordersSlice.actions
export default ordersSlice.reducer
