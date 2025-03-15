import admin from "./firebase.js"
// Assure-toi que Firebase Admin SDK est bien configuré

const setAdminRole = async (email) => {
  try {
    // 🔍 Trouver l'utilisateur par email
    const user = await admin.auth().getUserByEmail(email)

    // 🔥 Attribuer le rôle "admin" en Custom Claims
    await admin.auth().setCustomUserClaims(user.uid, { role: "admin" })
  } catch (error) {
    console.error("❌ Erreur lors de l'attribution du rôle :", error)
  }
}

// 🚀 Appelle la fonction avec l'email de l'admin que tu as créé
setAdminRole("admintest@admintest.fr")
