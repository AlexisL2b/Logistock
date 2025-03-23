import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getSupplierOrders,
  getSupplierOrderById,
  addSupplierOrder,
  updateSupplierOrder,
  deleteSupplierOrder,
} from "../api/supplierOrderApi"

// 🔥 Thunk - Récupérer toutes les commandes fournisseurs
export const fetchSupplierOrders = createAsyncThunk(
  "supplierOrders/fetchSupplierOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getSupplierOrders()
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk - Récupérer une commande fournisseur par ID
export const fetchSupplierOrderById = createAsyncThunk(
  "supplierOrders/fetchSupplierOrderById",
  async (id, { rejectWithValue }) => {
    try {
      return await getSupplierOrderById(id)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk - Ajouter une commande fournisseur
export const createSupplierOrder = createAsyncThunk(
  "supplierOrders/createSupplierOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      return await addSupplierOrder(orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk - Modifier une commande fournisseur
export const modifySupplierOrder = createAsyncThunk(
  "supplierOrders/modifySupplierOrder",
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      return await updateSupplierOrder(orderId, orderData)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔥 Thunk - Supprimer une commande fournisseur
export const removeSupplierOrder = createAsyncThunk(
  "supplierOrders/removeSupplierOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await deleteSupplierOrder(orderId)
      return orderId
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const supplierOrdersSlice = createSlice({
  name: "supplierOrders",
  initialState: {
    list: [],
    selectedOrder: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSupplierOrders: (state) => {
      state.list = []
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplierOrders.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSupplierOrders.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchSupplierOrders.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchSupplierOrderById.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSupplierOrderById.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.selectedOrder = action.payload
      })
      .addCase(fetchSupplierOrderById.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(createSupplierOrder.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(modifySupplierOrder.fulfilled, (state, action) => {
        const index = state.list.findIndex((o) => o._id === action.payload._id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(removeSupplierOrder.fulfilled, (state, action) => {
        state.list = state.list.filter((o) => o._id !== action.payload)
      })
  },
})

export const { clearSupplierOrders } = supplierOrdersSlice.actions
export default supplierOrdersSlice.reducer
