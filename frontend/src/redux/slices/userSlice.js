import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getBuyers,
} from "../api/userApi"

// 🔹 Thunk pour récupérer les utilisateurs depuis l'API
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers()
      return response.data // Assure-toi que ton API retourne `response.data`
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const fetchBuyers = createAsyncThunk(
  "users/fetchBuyers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBuyers()

      return response.data // Assure-toi que ton API retourne `response.data`
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔹 Thunk pour mettre à jour un utilisateur
export const updateUserInfo = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userUpdates }, { rejectWithValue }) => {
    try {
      const updatedUser = await updateUser(userId, userUpdates)

      return updatedUser.data // Assure-toi que ton API retourne `response.data`
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔹 Thunk pour supprimer un utilisateur
export const deleteUserById = createAsyncThunk(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await deleteUser(userId)
      return userId // Retourne l'ID de l'utilisateur supprimé pour mise à jour du state
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createUser(userData)
      return response.data // Assurez-vous que ton API retourne bien `response.data`
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout de l'utilisateur ce log est émit depuis le slice  :",
        error
      )
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📌 Gestion de l'ajout d'un utilisateur
      .addCase(addUser.fulfilled, (state, action) => {
        // state.list.push(action.payload) // Ajout immédiat au state
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload
      })

      // 📌 Gestion de la suppression d'un utilisateur

      // 📌 Gestion de la récupération des utilisateurs
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(fetchBuyers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchBuyers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchBuyers.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })

      // 📌 Gestion de la mise à jour d'un utilisateur
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        const updatedUser = action.payload
      })

      // 📌 Gestion de la suppression d'un utilisateur
      .addCase(deleteUserById.fulfilled, (state, action) => {
        // state.list = state.list.filter((user) => user._id !== action.payload)
      })
  },
})

export default userSlice.reducer
