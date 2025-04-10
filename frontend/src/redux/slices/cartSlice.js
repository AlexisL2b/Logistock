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
  items: [], // Chaque élément { product_id, quantity, detailsProduit }
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
      // //(`[Cart] Panier chargé pour l'utilisateur : ${userId}`)
    },

    // Ajouter un produit au panier
    addToCart: (state, action) => {
      const { userId, product_id, detailsProduit } = action.payload
      const existingProduct = state.items.find(
        (item) => item.product_id === product_id
      )

      if (existingProduct) {
        if (existingProduct.quantity < detailsProduit.quantity) {
          existingProduct.quantity += 1
          //(`[Cart] Quantité augmentée pour ${product_id}`)
        } else {
          console.warn(
            `[Cart] Impossible d'ajouter ${product_id} : stock insuffisant`
          )
        }
      } else {
        if (detailsProduit.quantity > 0) {
          state.items.push({ product_id, detailsProduit, quantity: 1 })
          //(`[Cart] Produit ajouté au panier : ${product_id}`)
        } else {
          console.warn(
            `[Cart] Impossible d'ajouter ${product_id} : stock épuisé`
          )
        }
      }

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Retirer un produit ou décrémenter sa quantité
    decrementFromCart: (state, action) => {
      const { userId, product_id } = action.payload
      //("action.payload", action.payload)
      const existingProduct = state.items.find(
        (item) => item.product_id === product_id
      )

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1
          //(`[Cart] Quantité réduite pour ${product_id}`)
        } else {
          state.items = state.items.filter(
            (item) => item.product_id !== product_id
          )
          //(`[Cart] Produit retiré du panier : ${product_id}`)
        }
      }

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Supprimer complètement un produit
    removeFromCart: (state, action) => {
      const { userId, product_id } = action.payload
      //(action.payload)
      state.items = state.items.filter((item) => item.product_id !== product_id)
      //(`[Cart] Produit retiré du panier : ${product_id}`)

      // Sauvegarde après modification
      saveToLocalStorage(userId, state.items)
    },

    // Vider complètement le panier
    clearCart: (state, action) => {
      const userId = action.payload // ID de l'utilisateur
      state.items = []
      //("[Cart] Panier vidé")

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
