import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import stockReducer from "./slices/stockSlice" // Import du stockSlice

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    stocks: stockReducer, // Ajout du stockSlice
  },
})
