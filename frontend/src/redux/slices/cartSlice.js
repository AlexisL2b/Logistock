import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [], // Chaque élément { produit_id, quantity, detailsProduit }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Ajouter un produit au panier
    addToCart: (state, action) => {
      const { produit_id, detailsProduit } = action.payload
      const existingProduct = state.items.find(
        (item) => item.produit_id === produit_id
      )

      if (existingProduct) {
        // Vérification de la quantité disponible
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
    },

    // Retirer un produit ou décrémenter sa quantité
    decrementFromCart: (state, action) => {
      const produit_id = action.payload
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
    },

    // Supprimer complètement un produit
    removeFromCart: (state, action) => {
      const produit_id = action.payload
      state.items = state.items.filter((item) => item.produit_id !== produit_id)
      console.log(`[Cart] Produit retiré du panier : ${produit_id}`)
    },

    // Vider complètement le panier
    clearCart: (state) => {
      state.items = []
      console.log("[Cart] Panier vidé")
    },
  },
})

export const { addToCart, decrementFromCart, removeFromCart, clearCart } =
  cartSlice.actions
export default cartSlice.reducer
