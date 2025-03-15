import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getProducts, updateProductStock } from "../api/productApi"

// Thunk pour récupérer les produits depuis l'API
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProducts()

      return response
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des produits slice :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour synchroniser le stock d'un produit
export const syncProductStock = createAsyncThunk(
  "products/syncStock",
  async ({ productId, stockUpdates }, { rejectWithValue }) => {
    try {
      const updatedProduct = await updateProductStock(productId, stockUpdates)
      return updatedProduct
    } catch (error) {
      console.error("Erreur lors de la synchronisation du stock :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(syncProductStock.fulfilled, (state, action) => {
        const updatedProduct = action.payload
        const productIndex = state.items.findIndex(
          (item) => item._id === updatedProduct._id
        )
        if (productIndex !== -1) {
          state.items[productIndex] = updatedProduct
        }
      })
  },
})

export default productsSlice.reducer
