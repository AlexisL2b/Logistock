import { loadStripe } from "@stripe/stripe-js"

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY // Si tu utilises Vite
// const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY; // Pour Create React App
const stripePromise = loadStripe(stripePublicKey)

export default stripePromise
