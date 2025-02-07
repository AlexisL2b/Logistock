import React, { useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import axiosInstance from "../../../../../axiosConfig"

const StripeModal = ({
  open,
  handleClose,
  clientSecret,
  orderId,
  onSuccess,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleCancelPayment = async () => {
    await axiosInstance.delete(`orders/${orderId}`)
    handleClose()
  }

  const handlePayment = async (event) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    if (!stripe || !elements) {
      setErrorMessage("Stripe n'est pas encore chargé.")
      setLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setErrorMessage("Problème avec l'élément de carte.")
      setLoading(false)
      return
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    )

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
    } else if (paymentIntent.status === "succeeded") {
      setSuccess(true)
      setLoading(false)

      try {
        const response = await axiosInstance.post("/orders/confirm-payment", {
          orderId,
          paymentIntentId: paymentIntent.id,
        })
        console.log("✅ Paiement confirmé :", response.data)

        onSuccess()
        setTimeout(() => {
          handleClose()
        }, 2000)
      } catch (err) {
        console.error("❌ Erreur backend confirmation paiement :", err)
        setErrorMessage("Erreur lors de la confirmation du paiement.")
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          handleCancelPayment()
          return
        }
      }}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        🔒 Paiement sécurisé avec Stripe
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", padding: "20px 30px" }}>
        <Typography variant="body1" sx={{ mb: 2, fontSize: "14px" }}>
          Saisissez vos informations de paiement ci-dessous.
        </Typography>

        <Box
          sx={{
            padding: "12px",
            border: "1px solid #d1d1d1",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            mb: 2,
          }}
        >
          <CardElement />
        </Box>

        {errorMessage && (
          <Typography sx={{ color: "red", fontSize: "14px", mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {success && (
          <Typography sx={{ color: "green", fontSize: "14px", mb: 2 }}>
            ✅ Paiement réussi ! 🎉
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleCancelPayment}
          disabled={loading}
          sx={{ color: "red" }}
        >
          Annuler
        </Button>
        <Button
          onClick={handlePayment}
          disabled={!stripe || loading}
          variant="contained"
          color="primary"
          sx={{
            minWidth: "120px",
            backgroundColor: "#556cd6",
            "&:hover": { backgroundColor: "#4054b2" },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Payer"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default StripeModal
