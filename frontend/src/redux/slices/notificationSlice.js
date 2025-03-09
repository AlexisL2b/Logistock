import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  open: false,
  message: "",
  severity: "info", // "success", "error", "warning", "info"
}

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.open = true // 🔥 Assure-toi que c'est bien mis à true
      state.message = action.payload.message
      state.severity = action.payload.severity || "info"
    },
    hideNotification: (state) => {
      state.open = false
      state.message = ""
      state.severity = "info"
    },
  },
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer
