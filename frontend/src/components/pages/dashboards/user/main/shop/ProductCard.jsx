import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import CardActionArea from "@mui/material/CardActionArea"
import AddToCartButton from "./AddToCartButton"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  updateQuantity,
} from "../../../../../../redux/slices/cartSlice"
import {
  decreaseStock,
  increaseStock,
} from "../../../../../../redux/slices/productsSlice"

export default function ProductCard({ product }) {
  const dispatch = useDispatch()

  // Récupère la quantité actuelle du produit dans le panier depuis Redux
  const quantity = useSelector(
    (state) =>
      state.cart.items.find((item) => item._id === product._id)?.quantity || 0
  )
  const stock = useSelector(
    (state) =>
      state.products.items.find((item) => item._id === product._id)
        ?.quantite_stock
  )
  // Ajouter une unité au panier
  const handleAdd = () => {
    if (stock > 0) {
      dispatch(addToCart(product)) // Ajoute le produit au panier
      dispatch(decreaseStock({ productId: product._id }))
      // Réduit le stock
    } else {
      console.warn("Stock épuisé pour ce produit !")
    }
  }

  // Retirer une unité du panier
  const handleRemove = () => {
    dispatch(updateQuantity({ productId: product._id })) // Retire du panier
    dispatch(increaseStock({ productId: product._id })) // Rétablit le stock
  }

  return (
    <Card>
      <CardActionArea
        sx={{
          height: "100%",
          "&[data-active]": {
            backgroundColor: "action.selected",
            "&:hover": {
              backgroundColor: "action.selectedHover",
            },
          },
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Typography variant="h4" component="div">
            {product.nom}
          </Typography>
          <Typography variant="h1" component="div">
            {product.categorie_id?.nom || "Catégorie inconnue"}
            {product.supplier_id?.nom || "Fournisseur inconnu"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
            {`Prix : ${product.prix} €`}
          </Typography>
          {/* Bouton contrôlé par le parent */}
          <AddToCartButton
            quantity={quantity}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
