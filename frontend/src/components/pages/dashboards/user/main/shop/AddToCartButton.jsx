import React from "react"
import { Button, Box, Typography } from "@mui/material"

export default function AddToCartButton({ quantity, onAdd, onRemove }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {quantity === 0 ? (
        // Bouton d'ajout initial
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
          sx={{ textTransform: "none" }}
        >
          Ajouter au panier
        </Button>
      ) : (
        // Boutons de contrôle de la quantité
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onRemove}
            sx={{ minWidth: "40px" }}
          >
            -
          </Button>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {quantity}
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={onAdd}
            sx={{ minWidth: "40px" }}
          >
            +
          </Button>
        </Box>
      )}
    </Box>
  )
}
