import { initializeApp } from "firebase/app"
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth"

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
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("✅ Persistence activée"))
  .catch((error) => console.error("⚠️ Erreur de persistence Firebase :", error))
// Exportez l'instance Firebase et l'auth
let hasTokenRefreshed = false // Empêche le double refresh

auth.onIdTokenChanged(async (user) => {
  if (!hasTokenRefreshed) {
    hasTokenRefreshed = true
    console.log("📢 onIdTokenChanged déclenché une seule fois.")

    if (user) {
      const idToken = await user.getIdToken()
      console.log("🔑 Token Firebase après refresh :", idToken)
    } else {
      console.log("❌ Aucun utilisateur après refresh.")
    }
  }
})

export default { app, auth }

// Obtenir l'instance Firebase Auth

// Surveiller les changements de token
