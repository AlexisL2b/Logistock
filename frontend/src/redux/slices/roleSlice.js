import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getRoles,
  getRoleById,
  addRole,
  updateRoleById,
  deleteRoleById,
} from "../api/roleApi"

// Thunk pour récupérer tous les rôles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      return await getRoles()
    } catch (error) {
      console.error("Erreur lors de la récupération des rôles :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour récupérer un rôle par ID
export const fetchRoleById = createAsyncThunk(
  "roles/fetchRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      return await getRoleById(roleId)
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour ajouter un rôle
export const createRole = createAsyncThunk(
  "roles/createRole",
  async (roleData, { rejectWithValue }) => {
    try {
      return await addRole(roleData)
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour mettre à jour un rôle
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ roleId, roleUpdates }, { rejectWithValue }) => {
    try {
      return await updateRoleById(roleId, roleUpdates)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// Thunk pour supprimer un rôle
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      await deleteRoleById(roleId)
      return roleId
    } catch (error) {
      console.error("Erreur lors de la suppression du rôle :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        const roleIndex = state.list.findIndex(
          (item) => item._id === action.payload._id
        )
        if (roleIndex === -1) {
          state.list.push(action.payload)
        } else {
          state.list[roleIndex] = action.payload
        }
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const roleIndex = state.list.findIndex(
          (item) => item._id === action.payload._id
        )
        if (roleIndex !== -1) {
          state.list[roleIndex] = action.payload
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item._id !== action.payload)
      })
  },
})

export default roleSlice.reducer
