import React from "react"
import { Box, Typography, Button } from "@mui/material"

export default function CartCardModal({
  product,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const { nom, prix, quantite_disponible, quantity = 0 } = product

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
          onClick={onDecrement}
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
          onClick={onIncrement}
          disabled={quantity >= quantite_disponible}
        >
          +
        </Button>
        <Button variant="text" color="error" onClick={onRemove}>
          Supprimer
        </Button>
      </Box>
    </Box>
  )
}
