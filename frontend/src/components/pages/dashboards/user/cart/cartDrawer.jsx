import React, { useState } from "react"
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
import {
  getFromLocalStorage,
  loadUserFromLocalStorage,
} from "../../../../../utils/localStorage"
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
  const user = getFromLocalStorage("user")
  console.log("user", user)
  const userId = user.id
  const dispatch = useDispatch()
  const [clientSecret, setClientSecret] = useState(null)
  const [orderId, setOrderId] = useState(null)
  console.log("cartItems from cartDrawer.jsx", cartItems)
  console.log("userId from cartDrawer.jsx", user._id)
  const handleCheckout = async () => {
    console.log("🚀 Checkout lancé, userId:", userId, "Total:", total)
    try {
      if (cartItems.length > 0) {
        // 🔥 Étape 1 : Préparer les produits et calculer le montant total
        const productsData = cartItems.map((item) => ({
          produit_id: item.produit_id,
          name: item.detailsProduit.nom,
          reference: item.detailsProduit.reference,
          prix: Number(item.detailsProduit.prix),
          quantite: Number(item.quantity),
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
          acheteur_id: userId,
          totalAmount: total * 100,
        })

        console.log("📤 Envoi des données au backend :", {
          acheteur_id: userId,
          totalAmount: total, // ✅ Vérifie qu'il s'affiche bien ici
        })

        // 🔥 Étape 2 : Créer la commande avec paiement Stripe
        const responseOrder = await axiosInstance.post(
          "http://localhost:5000/api/orders",
          {
            acheteur_id: userId,
            totalAmount: total,
          }
        )

        console.log("✅ Commande créée avec ID :", responseOrder)

        const orderId = responseOrder.data.order._id
        const clientSecret = responseOrder.data.clientSecret

        console.log("✅✅✅ Commande ID :", orderId)
        console.log("✅✅✅ ClientSecret :", clientSecret)

        // 🔥 Étape 3 : Ajouter les produits à la commande
        for (const product of productsData) {
          await axiosInstance.post("http://localhost:5000/api/order_details", {
            commande_id: orderId,
            produit_id: product.produit_id,
            name: product.name,
            reference: product.reference,
            quantite: product.quantite,
            prix_unitaire: product.prix,
          })
        }

        console.log("✅ Produits ajoutés à la commande")

        // 🔥 Étape 4 : Sauvegarder l'ID de commande et ouvrir Stripe
        setOrderId(orderId)
      }
    } catch (error) {
      console.error("❌ Erreur lors du checkout :", error.message)
    }
  }

  const handleCloseStripeModal = () => {
    setOpenStripeModal(false)
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
