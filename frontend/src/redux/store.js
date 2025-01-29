import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import stockReducer from "./slices/stockSlice" // Import du stockSlice
import authReducer from "./slices/authSlice" // Import du stockSlice
import ordersReducer from "./slices/orderSlice" // Import du stockSlice
import transporterSlice from "./slices/transporterSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    stocks: stockReducer, // Ajout du stockSlice
    auth: authReducer,
    orders: ordersReducer,
    transporters: transporterSlice,
  },
})
