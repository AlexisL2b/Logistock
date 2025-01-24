import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import { loadUserFromLocalStorage } from "../../utils/localStorage"

// Fonctions utilitaires pour gérer localStorage
const saveUserToLocalStorage = (userData) => {
  try {
    if (userData?._id) {
      localStorage.setItem(`user_${userData._id}`, JSON.stringify(userData))
    }
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde des données utilisateur dans localStorage :",
      error
    )
  }
}

const clearUserFromLocalStorage = () => {
  try {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("user_")
    )
    keys.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des données utilisateur :",
      error
    )
  }
}

// Thunk pour écouter les changements d'état Firebase
export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const auth = getAuth()

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const idToken = await user.getIdToken(true)
          const uid = user.uid

          // Récupérer les données utilisateur depuis le backend
          const response = await axios.get(
            `http://localhost:5000/api/users/${uid}`,
            {
              headers: { Authorization: `Bearer ${idToken}` },
            }
          )

          const userData = response.data
          saveUserToLocalStorage(userData) // Sauvegarder dans localStorage
          dispatch(setUser(userData)) // Mettre à jour Redux
        } else {
          dispatch(logout()) // Déconnecter si aucun utilisateur
        }
      })
    } catch (error) {
      console.error("Erreur lors de l'écoute des changements Firebase :", error)
      return rejectWithValue(error.message)
    }
  }
)

// Thunk pour récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        console.error("Erreur : auth.currentUser est null")
        return rejectWithValue("Utilisateur non connecté")
      }

      const idToken = await auth.currentUser.getIdToken(true)

      const response = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error)
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromLocalStorage(), // Charger l'utilisateur depuis localStorage
    status: loadUserFromLocalStorage() ? "succeeded" : "idle", // Définir un statut initial en fonction de la présence de données
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      const user = action.payload
      if (user) {
        state.user = user
        state.status = "succeeded" // Mise à jour du statut
        saveUserToLocalStorage(user) // Sauvegarde utilisateur
      }
    },
    logout: (state) => {
      clearUserFromLocalStorage() // Nettoyer localStorage pour l'utilisateur
      state.user = null
      state.status = "idle"
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listenToAuthState.pending, (state) => {
        state.status = "loading"
      })
      .addCase(listenToAuthState.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(listenToAuthState.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
