import React, { useState } from "react"
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
} from "@mui/material"
import { createOrder } from "../../../../../redux/slices/orderSlice"

import CloseIcon from "@mui/icons-material/Close"
import CartCardModal from "./CartCardModal"
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../../../../../utils/localStorage"
import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "../../../../../redux/slices/cartSlice"
import { createOrderDetails } from "../../../../../redux/slices/orderDetailsSlice"

export default function CartDrawer({
  open,
  onClose,
  total,
  cartItems,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const user = getFromLocalStorage("user")

  const userId = useSelector((state) => state.auth.user) // Récupération de l'ID utilisateur via Redux
  const { password, createdAt, updatedAt, __v, ...userInfos } = userId
  const dispatch = useDispatch()

  const [orderId, setOrderId] = useState(null)

  const handleCheckout = async () => {
    try {
      if (cartItems.length > 0) {
        // 🔥 Étape 1 : Préparer les produits et calculer le montant total
        const productsData = cartItems.map((item) => ({
          product_id: item.product_id,
          name: item.detailsProduit.name,
          reference: item.detailsProduit.reference,
          price: Number(item.detailsProduit.price),
          quantity: Number(item.quantity),
        }))

        const total = Number(
          cartItems
            .reduce(
              (sum, item) => sum + item.detailsProduit.price * item.quantity,
              0
            )
            .toFixed(2)
        )

        console.log("📤 Envoi des données au backend :", {
          buyer_id: userInfos,
          totalAmount: total,
          products: productsData, // ✅ Intégration directe des produits dans `orders`
        })

        // 🔥 Étape 2 : Dispatch Redux pour créer la commande
        const newOrder = await dispatch(
          createOrder({
            buyer_id: userInfos,
            totalAmount: total,
            details: productsData, // ✅ Respecte le modèle OrderModel
            statut: "en cours",
            orderedAt: new Date(),
            // date_order: new Date(),
          })
        )
        productsData.map((product) => {
          dispatch(
            createOrderDetails({
              order_id: newOrder.payload.order._id,
              ...product,
            })
          )
        })
        if (newOrder.error) {
          throw new Error(newOrder.error.message)
        }

        // 🔥 Étape 3 : Nettoyer le panier et fermer la modal
        setOrderId(newOrder.payload._id)
        removeFromLocalStorage("cart_" + userInfos._id)
        dispatch(clearCart()) // Nettoyage Redux du panier
        onClose()
      } else {
        console.warn("🛒 Panier vide, impossible de passer la commande.")
      }
    } catch (error) {
      console.error("❌ Erreur lors du checkout :", error.message)
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
                key={item.product_id}
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
            color="success"
            sx={{ textTransform: "none", mb: 1 }}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Commander
          </Button>
          <Button
            variant="outlined"
            fullWidth
            color="blue"
            sx={{ textTransform: "none" }}
            onClick={onClose}
          >
            Continuer mes achats
          </Button>
        </Box>
      </Box>

      {/* 🔥 Modale Stripe pour paiement */}
    </Drawer>
  )
}
