import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createStockLog } from "../api/stockLogApi"

// Thunk pour récupérer tous les rôles

// Thunk pour ajouter un rôle
export const createLog = createAsyncThunk(
  "stockLogs/createLog",
  async (logsData, { rejectWithValue }) => {
    try {
      return await createStockLog(logsData)
    } catch (error) {
      console.error("Erreur lors de l'ajout de logs :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour mettre à jour un rôle

// Thunk pour supprimer un rôle

const stockLogSlice = createSlice({
  name: "stockLogs",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLog.pending, (state) => {
        state.status = "loading"
      })
      .addCase(createLog.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(createLog.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export default stockLogSlice.reducer
