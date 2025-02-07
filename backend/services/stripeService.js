import StripeDAO from "../dao/stripeDAO.js"

class StripeService {
  async createPayment(amount, currency, description) {
    if (!amount || !currency) {
      throw new Error("Montant et devise requis")
    }

    return await StripeDAO.createPaymentIntent(amount, currency, description)
  }
}

export default new StripeService()
