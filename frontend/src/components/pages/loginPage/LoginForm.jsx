import { Box, TextField, Typography, Button } from "@mui/material"
import React, { useEffect, useState } from "react"
import { getAuth, signInWithCustomToken, signOut } from "firebase/auth"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { setUser } from "../../../redux/slices/authSlice"
import axiosInstance from "../../../axiosConfig"
import { saveToLocalStorage } from "../../../utils/localStorage"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const auth = getAuth()
    signOut(auth).catch((error) =>
      console.error("Erreur lors de la déconnexion Firebase :", error)
    )
  }, [])

  const handleLogin = async () => {
    try {
      const loginRes = await axiosInstance.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      )

      const customToken = loginRes.data.customToken
      if (!customToken) {
        console.error("❌ Erreur : Aucun customToken reçu !")
        setError("Erreur d'authentification. Token manquant.")
        return
      }

      console.log("✅ Custom Token reçu :", customToken)

      // 🔥 Se connecter avec le Custom Token pour obtenir un ID Token
      const auth = getAuth()
      const userCredential = await signInWithCustomToken(auth, customToken)
      const idTokenResult = await userCredential.user.getIdTokenResult() // 🔥 Récupère l'ID Token avec les claims Firebase

      console.log("✅ ID Token obtenu :", idTokenResult.token)

      // 🔥 Extraire le rôle depuis Firebase Claims
      const role = idTokenResult.claims.role || "user" // 🔥 Récupère le rôle sécurisé depuis Firebase
      console.log("✅ Rôle extrait du token :", role)

      // 🔥 Stocker l'ID Token en backend via un cookie
      const storeTokenRes = await axiosInstance.post(
        "http://localhost:5000/api/auth/store-token",
        { idToken: idTokenResult.token }
      )

      console.log(
        "✅ Réponse du backend après stockage du token :",
        storeTokenRes.data
      )

      // ⏳ Attendre 500ms pour être sûr que le cookie est bien stocké
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 🔥 Enregistre l'utilisateur avec son rôle
      dispatch(setUser({ uid: userCredential.user.uid, role }))
      // 🔥 Redirige en fonction du rôle
      switch (role) {
        case "Admin":
          navigate("/admin-dashboard")
          break
        case "Gestionnaire":
          navigate("/gestionnaire-dashboard")
          break
        case "Logisticien":
          navigate("/logisticien-dashboard")
          break
        default:
          navigate("/user-dashboard")
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err)
      setError("Connexion échouée. Vérifiez vos identifiants.")
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Fond plus opaque
        borderRadius: "12px",
        padding: 4,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        width: { xs: "90%", sm: "400px" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Connexion
      </Typography>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ style: { color: "#fff" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#fff",
            },
            "&:hover fieldset": {
              borderColor: "#2196F3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196F3",
            },
            color: "#fff",
          },
          input: { color: "#fff" },
        }}
      />

      <TextField
        label="Mot de passe"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#fff" } }}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#fff",
            },
            "&:hover fieldset": {
              borderColor: "#2196F3",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#2196F3",
            },
            color: "#fff",
          },
          input: { color: "#fff" },
        }}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{
          marginTop: 2,
          padding: "12px",
          fontSize: "16px",
          fontWeight: "bold",
          backgroundColor: "#1976D2",
          "&:hover": {
            backgroundColor: "#1565C0",
          },
        }}
        onClick={handleLogin}
      >
        SE CONNECTER
      </Button>
    </Box>
  )
}
