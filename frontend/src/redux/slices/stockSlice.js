import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getStock, getStockByProductId, updateStockById } from "../api/stockApi"

// Thunk pour récupérer le stock d'un produit
export const fetchStockByProductId = createAsyncThunk(
  "stocks/fetchStockByProductId",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getStockByProductId(productId)
      return response
    } catch (error) {
      console.error("Erreur lors de la récupération du stock :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStock()
      console.log("Response complète :", response) // Vérifiez le contenu
      return response.data // Retournez directement le tableau des stocks
    } catch (error) {
      console.error("Erreur lors de la récupération des stocks :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour mettre à jour un stock
export const updateStock = createAsyncThunk(
  "stocks/updateStock",
  async ({ stockId, stockUpdates }, { rejectWithValue }) => {
    try {
      const response = await updateStockById(stockId, stockUpdates)
      return response
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const stockSlice = createSlice({
  name: "stocks",
  initialState: {
    items: [], // Liste des stocks
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockByProductId.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStockByProductId.fulfilled, (state, action) => {
        state.status = "succeeded"
        const stockIndex = state.items.findIndex(
          (item) => item.produit_id === action.payload.produit_id
        )
        if (stockIndex === -1) {
          state.items.push(action.payload)
        } else {
          state.items[stockIndex] = action.payload
        }
      })
      .addCase(fetchStockByProductId.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchStocks.pending, (state) => {
        state.status = "loading"
      })

      .addCase(fetchStocks.fulfilled, (state, action) => {
        console.log("Payload reçu dans fulfilled :", action.payload)
        state.status = "succeeded"
        state.stocks = action.payload
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        const updatedStock = action.payload
        const stockIndex = state.items.findIndex(
          (item) => item._id === updatedStock._id
        )
        if (stockIndex !== -1) {
          state.items[stockIndex] = updatedStock
        }
      })
  },
})

export default stockSlice.reducer
