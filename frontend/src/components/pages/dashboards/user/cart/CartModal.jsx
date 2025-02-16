import React from "react"
import {
  Modal,
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

export default function CartModal({
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
  //(cartItems)
  console.log("cartItems", cartItems)
  const handleCheckout = async () => {
    try {
      if (cartItems.length > 0) {
        const responseOrder = await axiosInstance.post(
          "http://localhost:5000/api/orders",
          { acheteur_id: userId }
        )
        const orderId = responseOrder.data._id
        //(orderId)
        console.log("cartItems", cartItems)
        cartItems.forEach(async (item) => {
          const productId = item.product_id
          const name = item.detailsProduit.name
          const quantity = item.quantity
          const priceUnite = item.detailsProduit.prix
          const reference = item.detailsProduit.reference
          const orderDetailToAdd = {
            commande_id: orderId,
            name: name,
            product_id: productId,
            quantity: quantity,
            price: priceUnite,
            reference: reference,
          }
          const responseOrder = await axiosInstance.post(
            "http://localhost:5000/api/order_details",
            orderDetailToAdd
          )
          dispatch(clearCart())
          onClose()
        })
      }
      //("cartItems Vide")
    } catch (error) {
      //(error)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: "0",
          transform: "translateY(-50%)",
          width: { xs: "90%", sm: "400px" },
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
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
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box
          sx={{
            flex: 1,
            mt: 2,
            overflowY: "auto",
          }}
        >
          {cartItems.map((item) => (
            <CartCardModal
              key={item.product_id}
              product={item}
              onIncrement={() => onIncrement(item)}
              onDecrement={() => onDecrement(item)}
              onRemove={() => onRemove(item)}
            />
          ))}
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
          >
            Checkout
          </Button>
          <Button
            variant="outlined"
            fullWidth
            color="secondary"
            sx={{ textTransform: "none" }}
            onClick={onClose}
          >
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
