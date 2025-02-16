import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getTransporters, updateTransporter } from "../api/transporterApi"

// Thunk pour récupérer les transporteurs depuis l'API
export const fetchTransporters = createAsyncThunk(
  "transporters/fetchTransporters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTransporters()
      console.log("response", response)
      return response.data // Assure-toi que ton API retourne `response.data`
    } catch (error) {
      console.error("Erreur lors de la récupération des transporteurs :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour mettre à jour un transporteur
export const updateTransporterInfo = createAsyncThunk(
  "transporters/updateTransporter",
  async ({ transporterId, transporterUpdates }, { rejectWithValue }) => {
    try {
      const updatedTransporter = await updateTransporter(
        transporterId,
        transporterUpdates
      )
      return updatedTransporter.data // Assure-toi que ton API retourne `response.data`
    } catch (error) {
      console.error("Erreur lors de la mise à jour du transporteur :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const transporterSlice = createSlice({
  name: "transporters",
  initialState: {
    list: [], // Modification ici : `list` au lieu de `items`
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransporters.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTransporters.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload // Mise à jour de `list` avec les transporteurs
      })
      .addCase(fetchTransporters.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(updateTransporterInfo.fulfilled, (state, action) => {
        const updatedTransporter = action.payload
        const transporterIndex = state.list.findIndex(
          (item) => item._id === updatedTransporter._id
        )
        if (transporterIndex !== -1) {
          state.list[transporterIndex] = updatedTransporter
        }
      })
  },
})

export default transporterSlice.reducer
