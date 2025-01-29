import React from "react"
import { Box, Typography, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  decrementFromCart,
  removeFromCart,
} from "../../../../../redux/slices/cartSlice"

export default function CartCardModal({
  product,

  onRemove,
}) {
  const { nom, prix, quantite_disponible, quantity = 0 } = product
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.produit_id === product.produit_id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const handleAddToCart = () => {
    //("cartItem", cartItem)
    dispatch(
      addToCart({
        userId,
        produit_id: cartItem.produit_id,
        detailsProduit: cartItem.detailsProduit,
      })
    )
  }

  const handleDecrement = () => {
    if (cartItem?.quantity > 0) {
      dispatch(decrementFromCart({ userId, produit_id: cartItem.produit_id }))
    }
  }
  const handleRemove = () => {
    dispatch(removeFromCart({ userId, produit_id: cartItem.produit_id }))
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
      }}
    >
      {/* Informations sur le produit */}
      <Box>
        <Typography variant="h6" component="div">
          {nom}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Prix : ${prix} €`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Quantité disponible : ${quantite_disponible}`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`Dans le panier : ${quantity}`}
        </Typography>
      </Box>

      {/* Actions sur le produit */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDecrement}
          disabled={quantity === 0}
        >
          -
        </Button>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {quantity}
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleAddToCart}
          disabled={quantity >= quantite_disponible}
        >
          +
        </Button>
        <Button variant="text" color="error" onClick={handleRemove}>
          Supprimer
        </Button>
      </Box>
    </Box>
  )
}
