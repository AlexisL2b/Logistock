import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCPxn8QLxoaAxYLtgytHvIHssG8kFMZMFY",
  authDomain: "logistock-5d287.firebaseapp.com",
  projectId: "logistock-5d287",
  storageBucket: "logistock-5d287.appspot.com",
  messagingSenderId: "112469677435",
  appId: "1:112469677435:web:xxxxxxxxxxxxxxxx", // Remplacez par l'appId si disponible
}

// Initialisez Firebase
const app = initializeApp(firebaseConfig)

// Exportez l'instance Firebase et l'auth
export const auth = getAuth(app)
export default app
