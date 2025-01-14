import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer, // Ajoutez d'autres reducers ici si nécessaire
    cart: cartReducer, // Ajoutez d'autres reducers ici si nécessaire
  },
})

export default store
