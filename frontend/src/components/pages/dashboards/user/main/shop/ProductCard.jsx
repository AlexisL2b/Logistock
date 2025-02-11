import React from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  IconButton,
} from "@mui/material"
import AddToCartButton from "./AddToCartButton"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  decrementFromCart,
} from "../../../../../../redux/slices/cartSlice"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.produit_id === product._id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const quantity = cartItem?.quantity || 0

  const handleAddToCart = () => {
    console.log("userId", userId)
    console.log("product._id", product._id)
    console.log("product", product)
    dispatch(
      addToCart({ userId, produit_id: product._id, detailsProduit: product })
    )
  }

  const handleDecrement = () => {
    if (quantity > 0) {
      dispatch(decrementFromCart({ userId, produit_id: product._id }))
    }
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 350,
        height: "100%",
        borderRadius: 2,
        boxShadow: 3,
        transition: "all 0.3s ease",
        "&:hover": { boxShadow: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <CardActionArea sx={{ flex: 1 }}>
        <CardContent>
          {/* Nom du produit */}
          <Typography
            variant="h5"
            component="div"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {product.nom}
          </Typography>

          {/* Catégorie et Fournisseur */}
          <Typography variant="body2" color="text.secondary">
            {product.categorie_id?.nom || "Catégorie inconnue"} -{" "}
            {product.supplier_id?.nom || "Fournisseur inconnu"}
          </Typography>

          {/* Description */}
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            {product.description}
          </Typography>

          {/* Prix */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            {`Prix : ${product.prix} €`}
          </Typography>

          {/* Gestion de la quantité */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <IconButton
              size="small"
              color="error"
              onClick={handleDecrement}
              disabled={quantity === 0}
              sx={{
                border: "1px solid",
                // borderColor: "error.main",
                borderRadius: "8px",
                p: 1,
                transition: "background-color 0.3s ease", // Animation fluide
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)", // Rouge clair au hover
                  borderColor: "red",
                },
              }}
            >
              <RemoveIcon />
            </IconButton>

            <Typography variant="body1" sx={{ fontWeight: "bold", mx: 2 }}>
              {quantity}
            </Typography>

            <IconButton
              size="small"
              color="primary"
              onClick={handleAddToCart}
              sx={{ border: "1px solid", borderRadius: "8px", p: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
