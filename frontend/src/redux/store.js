import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./slices/productsSlice"
import cartReducer from "./slices/cartSlice"
import stockReducer from "./slices/stockSlice" // Import du stockSlice
import authReducer from "./slices/authSlice" // Import du stockSlice
import ordersReducer from "./slices/orderSlice" // Import du stockSlice
import transporterReducer from "./slices/transporterSlice"
import roleReducer from "./slices/roleSlice"
import salesPointReducer from "./slices/salesPointSlice"
import userReducer from "./slices/userSlice"
import orderDetailsReducer from "./slices/orderDetailsSlice"
import notificationReducer from "./slices/notificationSlice"
import stockLogsReducer from "./slices/stockLogSlice"
import orderShipmentsReducer from "./slices/orderShipmentSlice"
import supplierOrdersReducer from "./slices/supplierOrderSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    stocks: stockReducer, // Ajout du stockSlice
    auth: authReducer,
    orders: ordersReducer,
    transporters: transporterReducer,
    roles: roleReducer,
    salesPoints: salesPointReducer,
    users: userReducer,
    orderDetails: orderDetailsReducer,
    notification: notificationReducer,
    stockLogs: stockLogsReducer,
    orderShipments: orderShipmentsReducer,
    supplierOrder: supplierOrdersReducer,
  },
})
