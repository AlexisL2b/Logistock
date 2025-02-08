import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getStock,
  getStockByProductId,
  getStockWithProducts,
  updateStockById,
} from "../api/stockApi"

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

// Thunk pour récupérer tous les stocks
export const fetchStocks = createAsyncThunk(
  "stocks/fetchStocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStock()
      //("Response complète :", response) // Vérifiez le contenu
      return response.data // Retournez directement le tableau des stocks
    } catch (error) {
      console.error("Erreur lors de la récupération des stocks :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const fetchStocksWithProduct = createAsyncThunk(
  "stocks/fetchStocksWithProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStockWithProducts()
      console.log("response from slice", response)
      return response // Retournez directement le tableau des stocks
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des stocksWithProducts :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour mettre à jour un stock individuel
export const updateStock = createAsyncThunk(
  "stocks/updateStock",
  async ({ stockId, stockUpdates }, { rejectWithValue }) => {
    try {
      //("stockId from stockSlice", stockId)
      //("stockUpdates from stockSlice", stockUpdates)
      const response = await updateStockById(stockId, stockUpdates)
      console.log("stockUpdates", stockUpdates)
      console.log(stockId, stockId)
      //("response from slice", response)
      return response
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour du stock depuis le slice :",
        error
      )
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
  reducers: {
    // Action pour mettre à jour plusieurs stocks en temps réel (par exemple via Socket.IO)
    updateStocks(state, action) {
      const updatedStocks = action.payload
      updatedStocks.forEach((updatedStock) => {
        const index = state.items.findIndex(
          (item) => item.produit_id === updatedStock.produit_id
        )
        if (index !== -1) {
          state.items[index] = updatedStock // Mettre à jour le stock existant
        } else {
          state.items.push(updatedStock) // Ajouter un nouveau stock si inexistant
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestion de fetchStockByProductId
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

      // Gestion de fetchStocks
      .addCase(fetchStocks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        //("Payload reçu dans fulfilled :", action.payload)
        state.status = "succeeded"
        state.stocks = action.payload // Met à jour toute la liste des stocks
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchStocksWithProduct.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchStocksWithProduct.fulfilled, (state, action) => {
        //("Payload reçu dans fulfilled :", action.payload)
        state.status = "succeeded"
        state.stocksProducts = action.payload // Met à jour toute la liste des stocks
      })
      .addCase(fetchStocksWithProduct.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // Gestion de updateStock
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

// Export des actions et du reducer
export const { updateStocks } = stockSlice.actions
export default stockSlice.reducer
