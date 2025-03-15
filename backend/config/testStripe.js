import stripe from "./stripeConfig.js"
;(async () => {
  try {
    const balance = await stripe.balance.retrieve()
  } catch (error) {
    console.error("❌ Erreur de connexion à Stripe :", error)
  }
})()
