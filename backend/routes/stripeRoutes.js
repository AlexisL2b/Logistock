import express from "express"
import { createPaymentIntent } from "../controllers/stripeController.js"
import authenticate from "../middlewares/authenticate.js" // Si nécessaire

const router = express.Router()

// ✅ Route protégée pour initier un paiement
// router.post("/create-payment-intent", authenticate, createPaymentIntent)
router.post("/create-payment-intent", createPaymentIntent)

export default router
