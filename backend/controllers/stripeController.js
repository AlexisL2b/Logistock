import StripeService from "../services/stripeService.js"

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, description } = req.body
    const paymentIntent = await StripeService.createPayment(
      amount,
      currency,
      description
    )

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      message: "Paiement initialisé avec succès",
    })
  } catch (error) {
    console.error("❌ Erreur dans le contrôleur Stripe :", error.message)
    res.status(500).json({ message: error.message })
  }
}
