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

export default function CartModal({
  open,
  onClose,
  total,
  cartItems,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  // console.log("cartItems from modal", cartItems)

  const onSubmit = async (cartItems) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        cartItems
      )
      console.log("commande créée", response.data)
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error)
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
              key={item.produit_id}
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
