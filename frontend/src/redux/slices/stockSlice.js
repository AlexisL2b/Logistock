import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  decrementStocks,
  getStock,
  getStockByProductId,
  getStockWithProducts,
  updateStockById,
  incrementStock,
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
export const decrementStock = createAsyncThunk(
  "stocks/decrementStock",
  async (orderdetails, { rejectWithValue }) => {
    try {
      const response = await decrementStocks(orderdetails)

      return response
    } catch (error) {
      console.error("Erreur lors de la décrémentation des stocks :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const incrementStocks = createAsyncThunk(
  "stocks/incrementStocks",
  async ({ stockId, quantity }, { rejectWithValue }) => {
    try {
      console.log("stockId depuis stockSlice.js", stockId)
      console.log("quantity depuis stockSlice.js", quantity)
      const response = await incrementStock(stockId, quantity)

      return response
    } catch (error) {
      console.error("Erreur lors de l'incrementation' des stocks :", error)
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
    updateStock: (state, action) => {
      const stockId = action.payload.stockId
      const stockUpdates = action.payload.stockUpdates

      // const stockIndex = state.stocksProducts.findIndex(
      //   (stock) => stock._id === stockId
      // )
      // if (stockIndex !== -1) {
      //   state.stocksProducts[stockIndex] = {
      //     ...state.stocksProducts[stockIndex],
      //     ...stockUpdates,
      //   }
      // }
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
          (item) => item.product_id === action.payload.product_id
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
      .addCase(decrementStock.pending, (state) => {
        state.status = "loading"
      })
      .addCase(decrementStock.fulfilled, (state, action) => {
        state.status = "succeeded"

        const { productId, updatedStock } = action.payload
        const stockIndex = state.items.findIndex(
          (stock) => stock.product_id === productId
        )
        if (stockIndex !== -1) {
          state.items[stockIndex] = updatedStock
        }
      })
      .addCase(decrementStock.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(incrementStocks.pending, (state) => {
        state.status = "loading"
      })
      .addCase(incrementStocks.fulfilled, (state, action) => {
        state.status = "succeeded"

        // const { productId, updatedStock } = action.payload
        // const stockIndex = state.items.findIndex(
        //   (stock) => stock.product_id === productId
        // )
        // if (stockIndex !== -1) {
        //   state.items[stockIndex] = updatedStock
        // }
      })
      .addCase(incrementStocks.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
    // Gestion de updateStock
    // .addCase(updateStock.fulfilled, (state, action) => {
    //   const updatedStock = action.payload
    //   const stockIndex = state.items.findIndex(
    //     (item) => item._id === updatedStock._id
    //   )
    //   if (stockIndex !== -1) {
    //     state.items[stockIndex] = updatedStock
    //   }
    // })
  },
})

// Export des actions et du reducer
export const { updateStock } = stockSlice.actions
export default stockSlice.reducer
