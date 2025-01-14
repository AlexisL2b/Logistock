import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // Tableau d'objets représentant les produits dans le panier
  },
  reducers: {
    // Ajouter un produit au panier
    addToCart: (state, action) => {
      const product = action.payload

      console.log("Action: addToCart - Produit reçu :", product) // Log du produit reçu par l'action

      const existingProduct = state.items.find(
        (item) => item._id === product._id
      )

      if (existingProduct) {
        existingProduct.quantity += 1 // Si le produit existe, incrémente sa quantité
        console.log(
          `Produit existant trouvé : ${existingProduct.nom}, nouvelle quantité : ${existingProduct.quantity}`
        )
      } else {
        state.items.push({ ...product, quantity: 1 }) // Sinon, ajoute le produit avec quantité = 1
        console.log("Produit ajouté au panier :", { ...product, quantity: 1 })
      }

      console.log(
        "État actuel du panier après ajout :",
        JSON.parse(JSON.stringify(state.items))
      ) // Log complet du panier
    },

    // Retirer un produit du panier
    removeFromCart: (state, action) => {
      const productId = action.payload

      console.log("Action: removeFromCart", productId) // Log de l'ID du produit retiré

      state.items = state.items.filter((item) => item._id !== productId)

      console.log("État actuel du panier après suppression :", state.items) // Log de l'état du panier après suppression
    },

    // Mettre à jour la quantité d'un produit
    updateQuantity: (state, action) => {
      const { productId } = action.payload

      console.log("Action: updateQuantity", { productId }) // Log du produit ciblé

      // Trouve le produit dans le panier
      const existingProduct = state.items.find((item) => item._id === productId)

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1 // Réduit la quantité de 1
          console.log(
            `Quantité mise à jour pour le produit ${productId}. Nouvelle quantité : ${existingProduct.quantity}`
          )
        } else {
          // Si la quantité tombe à 0, retire le produit du panier
          state.items = state.items.filter((item) => item._id !== productId)
          console.log(
            `Produit ${productId} retiré du panier car la quantité est tombée à 0.`
          )
        }
      } else {
        console.warn(
          `Impossible de mettre à jour la quantité. Le produit avec l'ID ${productId} n'est pas dans le panier.`
        )
      }

      console.log(
        "État actuel du panier après mise à jour :",
        JSON.parse(JSON.stringify(state.items))
      ) // Log de l'état actuel du panier
    },

    // Vider le panier
    clearCart: (state) => {
      console.log("Action: clearCart") // Log de l'action de vider le panier

      state.items = []

      console.log("Panier vidé, état actuel :", state.items) // Log de l'état du panier après suppression
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions
export default cartSlice.reducer
