import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getSalesPoint } from "../api/salesPointApi"

// Thunk pour récupérer les points de vente depuis l'API
export const fetchSalesPoints = createAsyncThunk(
  "salesPoints/fetchSalesPoints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSalesPoint()
      return response
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des points de vente :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const salesPointSlice = createSlice({
  name: "salesPoints",
  initialState: {
    salesPoints: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesPoints.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchSalesPoints.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.salesPoints = action.payload
      })
      .addCase(fetchSalesPoints.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export default salesPointSlice.reducer
