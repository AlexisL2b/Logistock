import React, { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import CloseIcon from "@mui/icons-material/Close"
import { useDispatch, useSelector } from "react-redux"
import {
  addToCart,
  decrementFromCart,
} from "../../../../../../redux/slices/cartSlice"

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const cartItem = useSelector((state) =>
    state.cart.items.find((item) => item.product_id === product._id)
  )
  const userId = useSelector((state) => state.auth.user._id)

  const quantity = cartItem?.quantity || 0

  const handleAddToCart = (event) => {
    event.stopPropagation() // Empêche l'ouverture de la modale
    dispatch(
      addToCart({ userId, product_id: product._id, detailsProduit: product })
    )
  }

  const handleDecrement = (event) => {
    event.stopPropagation() // Empêche l'ouverture de la modale
    if (quantity > 0) {
      dispatch(decrementFromCart({ userId, product_id: product._id }))
    }
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      {/* 🏷️ Carte du produit */}
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
          cursor: "pointer",
        }}
      >
        {/* 🖼️ Zone cliquable pour ouvrir la modale */}
        <Box onClick={handleOpen} sx={{ width: "100%", flex: 1 }}>
          {product.image && (
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",
                height: 150,
                objectFit: "cover",
                borderRadius: "8px",
                mb: 2,
              }}
            />
          )}
          <CardContent sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              {product.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {product.category_id?.name || "Catégorie inconnue"} -{" "}
              {product.supplier_id?.name || "Fournisseur inconnu"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ my: 1, overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {product.description || "Aucune description disponible."}
            </Typography>

            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              {`Prix : ${product.price} €`}
            </Typography>
          </CardContent>
        </Box>

        {/* 🛒 Gestion de la quantité (pas cliquable pour ouvrir la modale) */}
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
              borderRadius: "8px",
              p: 1,
              transition: "background-color 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 0.1)",
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
      </Card>

      {/* 🏷️ Modale d'affichage des détails */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {product.name}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {product.image && (
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: "100%",
                height: 250,
                objectFit: "cover",
                borderRadius: "8px",
                mb: 2,
              }}
            />
          )}
          <Typography variant="body2" color="text.secondary">
            Catégorie :{" "}
            <strong>{product.category_id?.name || "Inconnue"}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fournisseur :{" "}
            <strong>{product.supplier_id?.name || "Inconnu"}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description || "Aucune description disponible."}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "primary.main", mt: 2 }}
          >
            Prix : {product.price} €
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}
