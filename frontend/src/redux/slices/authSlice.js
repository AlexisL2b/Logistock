import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth"
import axiosInstance from "../../axiosConfig" // Assure-toi que le chemin est bon
import { loadUserFromLocalStorage } from "../../utils/localStorage"

// 🔹 Utilitaires LocalStorage
const saveUserToLocalStorage = (userData) => {
  try {
    if (userData?._id) {
      localStorage.setItem(`user_${userData._id}`, JSON.stringify(userData))
    }
  } catch (error) {
    console.error(
      "Erreur lors de la sauvegarde des données utilisateur :",
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

// 🔹 Écoute les changements d'auth Firebase
export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const auth = getAuth()

      return new Promise(async (resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              // ✅ Attendre 500ms pour éviter la déconnexion intempestive
              await new Promise((resolve) => setTimeout(resolve, 500))

              // 🔥 Vérifier l'authentification auprès du backend
              const response = await axiosInstance.get(
                "http://localhost:5000/api/users/me"
              )

              const userData = response.data

              saveUserToLocalStorage(userData)
              dispatch(setUser(userData))
              resolve(userData)
            } catch (error) {
              console.warn("🚨 Échec de vérification du token, déconnexion...")
              dispatch(logout())
              resolve(null)
            }
          } else {
            // ⏳ Attendre un peu avant de forcer la déconnexion pour éviter un faux `null`
            setTimeout(() => {
              if (!auth.currentUser) {
                console.log(
                  "🚨 Aucun utilisateur Firebase détecté, déconnexion..."
                )
                dispatch(logout())
                resolve(null)
              }
            }, 1000)
          }
        })
      })
    } catch (error) {
      console.error("Erreur lors de l'écoute Firebase :", error)
      return rejectWithValue(error.message)
    }
  }
)

// 🔹 Récupérer le profil de l'utilisateur
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        return rejectWithValue("Utilisateur non connecté")
      }

      const idToken = await auth.currentUser.getIdToken(true)
      const response = await axiosInstance.get(
        "http://localhost:5000/api/users/me"
      )

      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔹 Mise à jour du profil utilisateur
export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, updatedFields }, { rejectWithValue, dispatch }) => {
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      // Vérifier si l'email a changé
      const emailUpdated =
        updatedFields.email && updatedFields.email !== currentUser.email

      // Mettre à jour l'utilisateur dans le backend
      const response = await axiosInstance.put(
        `http://localhost:5000/api/users/${userId}`,
        updatedFields
      )

      // Si l'email a été modifié, recharger Firebase et rafraîchir le token
      if (emailUpdated) {
        await currentUser.reload() // Recharge l'utilisateur Firebase
        const newToken = await currentUser.getIdToken(true) // Récupère un nouveau token

        // Mettre à jour Redux et LocalStorage avec le nouvel email
        localStorage.setItem("token", newToken)
        dispatch(setUser({ ...response.data, email: updatedFields.email }))
      } else {
        // Si l'email n'a pas changé, mettre à jour Redux et LocalStorage normalement
        dispatch(setUser(response.data))
      }
      // console.log("response from slice", response)
      saveUserToLocalStorage(response.data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

// 🔹 Slice Redux pour l'authentification
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: loadUserFromLocalStorage(), // Charger l'utilisateur depuis localStorage
    status: "idle",
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.status = "succeeded"
      saveUserToLocalStorage(action.payload)
    },
    logout: (state) => {
      clearUserFromLocalStorage()
      state.user = null
      state.status = "idle"
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
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading"
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.user = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload
      })
  },
})

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer
