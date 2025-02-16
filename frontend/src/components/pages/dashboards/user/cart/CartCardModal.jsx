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
  const { name, quantity } = product
  console.log(product)
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.product_id === product.product_id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        userId,
        product_id: cartItem.product_id,
        detailsProduit: cartItem.detailsProduit,
      })
    )
  }

  const handleDecrement = () => {
    if (cartItem?.quantity > 0) {
      dispatch(decrementFromCart({ userId, product_id: cartItem.product_id }))
    }
  }

  const handleRemove = () => {
    dispatch(removeFromCart({ userId, product_id: cartItem.product_id }))
  }
  console.log(product)
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
          {product.detailsProduit.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prix :{" "}
          <strong>
            {product.detailsProduit.price
              ? `${product.detailsProduit.price} €`
              : "Non défini"}
          </strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quantité disponible :{" "}
          <strong>{product.detailsProduit.quantity ?? "Non défini"}</strong>
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
          disabled={quantity >= product.detailsProduit.quantity}
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
