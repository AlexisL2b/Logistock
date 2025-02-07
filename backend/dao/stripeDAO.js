import stripe from "../config/stripeConfig.js"

class StripeDAO {
  async createPaymentIntent(amount, currency, description) {
    try {
      return await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe fonctionne en centimes
        currency,
        description,
        payment_method_types: ["card"],
      })
    } catch (error) {
      console.error("❌ Erreur Stripe DAO :", error)
      throw new Error("Erreur lors de la création du paiement")
    }
  }
}

export default new StripeDAO()
