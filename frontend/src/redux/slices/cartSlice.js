import { createSlice } from "@reduxjs/toolkit"

// Fonctions utilitaires pour localStorage
const saveToLocalStorage = (userId, cart) => {
  try {
    const key = `cart_${userId}` // Utiliser une clé spécifique pour chaque utilisateur
    localStorage.setItem(key, JSON.stringify(cart))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde dans localStorage :", error)
  }
}

const loadFromLocalStorage = (userId) => {
  try {
    const key = `cart_${userId}`
    const serializedState = localStorage.getItem(key)
    if (serializedState === null) return undefined // Aucun panier trouvé
    return JSON.parse(serializedState)
  } catch (error) {
    console.error("Erreur lors du chargement depuis localStorage :", error)
    return undefined
  }
}

const clearLocalStorageForUser = (userId) => {
  try {
    const key = `cart_${userId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du panier dans localStorage :",
      error
    )
  }
}

// État initial (vide au départ, dépendra de l'utilisateur)
const initialState = {
  items: [], // Chaque élément { produit_id, quantity, detailsProduit }
}

// Slice du panier
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Charger le panier d'un utilisateur
    loadCart: (state, action) => {
      const userId = action.payload // ID de l'utilisateur
      const cartFromStorage = loadFromLocalStorage(userId)
      state.items = cartFromStorage || [] // Charger depuis localStorage ou initialiser à vide
      // console.log(`[Cart] Panier chargé pour l'utilisateur : ${userId}`)
    },

    // Ajouter un produit au panier
    addToCart: (state, action) => {
      const { userId, produit_id, detailsProduit } = action.payload
      const existingProduct = state.items.find(
        (item) => item.produit_id === produit_id
      )

      if (existingProduct) {
        if (existingProduct.quantity < detailsProduit.quantite_disponible) {
          existingProduct.quantity += 1
          console.log(`[Cart] Quantité augmentée pour ${produit_id}`)
        } else {
          console.warn(
            `[Cart] Impossible d'ajouter ${produit_id} : stock insuffisant`
          )
        }
      } else {
        if (detailsProduit.quantite_disponible > 0) {
          state.items.push({ produit_id, detailsProduit, quantity: 1 })
          console.log(`[Cart] Produit ajouté au panier : ${produit_id}`)
        } else {
          console.warn(
            `[Cart] Impossible d'ajouter ${produit_id} : stock épuisé`
          )
        }
      }
      // console.log("userId from addToCart in slice", userId)
      console.log("action.payload", action.payload)

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Retirer un produit ou décrémenter sa quantité
    decrementFromCart: (state, action) => {
      const { userId, produit_id } = action.payload
      console.log("action.payload", action.payload)
      const existingProduct = state.items.find(
        (item) => item.produit_id === produit_id
      )

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1
          console.log(`[Cart] Quantité réduite pour ${produit_id}`)
        } else {
          state.items = state.items.filter(
            (item) => item.produit_id !== produit_id
          )
          console.log(`[Cart] Produit retiré du panier : ${produit_id}`)
        }
      }

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Supprimer complètement un produit
    removeFromCart: (state, action) => {
      const { userId, produit_id } = action.payload
      console.log(action.payload)
      state.items = state.items.filter((item) => item.produit_id !== produit_id)
      console.log(`[Cart] Produit retiré du panier : ${produit_id}`)

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Vider complètement le panier
    clearCart: (state, action) => {
      const userId = action.payload // ID de l'utilisateur
      state.items = []
      console.log("[Cart] Panier vidé")

      // Supprime les données du localStorage
      clearLocalStorageForUser(userId)
    },
  },
})

export const {
  loadCart,
  addToCart,
  decrementFromCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
