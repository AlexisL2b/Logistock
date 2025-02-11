import React from "react"
import { Box, Typography, Button, IconButton } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  decrementFromCart,
  removeFromCart,
} from "../../../../../redux/slices/cartSlice"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

export default function CartCardModal({ product }) {
  const { nom, prix, quantite_disponible, quantity = 0 } = product
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.produit_id === product.produit_id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const handleAddToCart = () => {
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
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        mb: 2,
        p: 2,
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: "background.paper",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      {/* Informations sur le produit */}
      <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {nom}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prix : <strong>{prix ? `${prix} €` : "Non défini"}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quantité disponible :{" "}
          <strong>{quantite_disponible ?? "Non défini"}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dans le panier : <strong>{quantity}</strong>
        </Typography>
      </Box>

      {/* Actions sur le produit */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: { xs: 2, sm: 0 },
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={handleDecrement}
          disabled={quantity === 0}
          sx={{ border: "1px solid", borderRadius: "8px", p: 1 }}
        >
          <RemoveIcon />
        </IconButton>

        <Typography
          variant="body1"
          sx={{ fontWeight: "bold", minWidth: "30px", textAlign: "center" }}
        >
          {quantity}
        </Typography>

        <IconButton
          size="small"
          color="primary"
          onClick={handleAddToCart}
          disabled={quantity >= quantite_disponible}
          sx={{ border: "1px solid", borderRadius: "8px", p: 1 }}
        >
          <AddIcon />
        </IconButton>

        <IconButton
          size="small"
          color="error"
          onClick={handleRemove}
          sx={{
            borderRadius: "8px",
            transition: "all 0.2s ease",
            "&:hover": { bgcolor: "error.light" },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
