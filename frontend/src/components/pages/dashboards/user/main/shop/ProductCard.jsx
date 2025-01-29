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
  decrementFromCart,
} from "../../../../../../redux/slices/cartSlice"

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.produit_id === product._id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const quantity = useSelector(
    (state) =>
      state.cart.items.find((item) => item.produit_id === product._id)
        ?.quantity || 0
  )
  const handleAddToCart = () => {
    dispatch(
      addToCart({ userId, produit_id: product._id, detailsProduit: product })
    )
  }

  const handleDecrement = () => {
    if (cartItem?.quantity > 0) {
      dispatch(decrementFromCart({ userId, produit_id: product._id }))
    }
  }
  // //(
  //   `[ProductCard] Quantité du produit ${product._id} dans le panier :`,
  //   quantity
  // )
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
          <Typography variant="h6" component="div">
            {product.categorie_id?.nom || "Catégorie inconnue"} -{" "}
            {product.supplier_id?.nom || "Fournisseur inconnu"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
            <br />
            {`Prix : ${product.prix} €`}
          </Typography>
          <AddToCartButton
            quantity={quantity}
            onAdd={handleAddToCart}
            onRemove={handleDecrement}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
