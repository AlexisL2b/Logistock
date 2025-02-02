const handleLogin = async () => {
  try {
    const loginRes = await axiosInstance.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    )

    const { customToken } = loginRes.data // ✅ Récupérer le `customToken`
    localStorage.setItem("customToken", customToken) // ✅ Sauvegarder le `customToken`

    const auth = getAuth()
    const userCredential = await signInWithCustomToken(auth, customToken)
    const idToken = await userCredential.user.getIdToken()

    localStorage.setItem("token", idToken) // Sauvegarder `idToken` pour API
    console.log("✅ Utilisateur connecté avec Firebase :", userCredential.user)

    navigate("/dashboard") // Rediriger après connexion
  } catch (err) {
    console.error("Erreur lors de la connexion :", err)
    setError("Connexion échouée.")
  }
}
