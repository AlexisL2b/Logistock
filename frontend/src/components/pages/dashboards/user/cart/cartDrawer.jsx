import React from "react"
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CartCardModal from "./CartCardModal"
import { loadUserFromLocalStorage } from "../../../../../utils/localStorage"
import { useDispatch } from "react-redux"
import { clearCart } from "../../../../../redux/slices/cartSlice"
import axiosInstance from "../../../../../axiosConfig"

export default function CartDrawer({
  open,
  onClose,
  total,
  cartItems,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const user = loadUserFromLocalStorage()
  const userId = user._id
  const dispatch = useDispatch()

  const handleCheckout = async () => {
    try {
      if (cartItems.length > 0) {
        const responseOrder = await axiosInstance.post(
          "http://localhost:5000/api/orders",
          { acheteur_id: userId }
        )
        const orderId = responseOrder.data._id

        for (const item of cartItems) {
          const orderDetailToAdd = {
            commande_id: orderId,
            name: item.detailsProduit.nom,
            produit_id: item.produit_id,
            quantite: item.quantity,
            prix_unitaire: item.detailsProduit.prix,
            reference: item.detailsProduit.reference,
          }
          await axiosInstance.post(
            "http://localhost:5000/api/order_details",
            orderDetailToAdd
          )
        }

        dispatch(clearCart())
        onClose()
      }
    } catch (error) {
      console.error("Erreur lors du checkout :", error)
    }
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "90vw", sm: "400px" },
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Ton panier</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, mt: 2, overflowY: "auto" }}>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartCardModal
                key={item.produit_id}
                product={item}
                onIncrement={() => onIncrement(item)}
                onDecrement={() => onDecrement(item)}
                onRemove={() => onRemove(item)}
              />
            ))
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
              Ton panier est vide
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 2 }}>
          <Divider />
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Total: {total} €
          </Typography>
          <Button
            variant="contained"
            fullWidth
            color="primary"
            sx={{ textTransform: "none", mb: 1 }}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Commander
          </Button>
          <Button
            variant="outlined"
            fullWidth
            color="secondary"
            sx={{ textTransform: "none" }}
            onClick={onClose}
          >
            Continuer mes achats
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
