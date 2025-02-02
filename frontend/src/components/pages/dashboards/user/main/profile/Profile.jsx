import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUserProfile,
  updateUser,
} from "../../../../../../redux/slices/authSlice"
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material"
import { Edit, Check, Close } from "@mui/icons-material"
import { fetchSalesPoints } from "../../../../../../redux/slices/salesPointSlice"
import { fetchRoles } from "../../../../../../redux/slices/roleSlice"
import axiosInstance from "../../../../../../axiosConfig"

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { salesPoints } = useSelector((state) => state.salesPoints)
  const { roles } = useSelector((state) => state.roles)
  const roleUser = "677cf977b39853e4a17727e3"

  const [isEditing, setIsEditing] = useState(false) // Mode édition ON/OFF
  const [userProfile, setUserProfile] = useState({
    prenom: user?.prenom || "",
    nom: user?.nom || "",
    email: user?.email || "",
    adresse: user?.adresse || "",
  })
  // console.log("salesPoints", salesPoints)
  const salePoint = salesPoints?.data?.find((s) => s._id == user.point_vente_id)
  const [prevUser, setPrevUser] = useState(userProfile)

  // État pour gérer les notifications
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [severity, setSeverity] = useState("info") // success | error | warning | info

  useEffect(() => {
    dispatch(fetchSalesPoints())
    dispatch(fetchRoles())
  }, [])
  useEffect(() => {
    setUserProfile({
      prenom: user?.prenom || "",
      nom: user?.nom || "",
      email: user?.email || "",
      adresse: user?.adresse || "",
    })
  }, [user])
  const handleEdit = () => {
    setPrevUser(userProfile) // Sauvegarde avant édition
    setIsEditing(true)
  }

  const handleCancel = () => {
    setUserProfile(prevUser) // Revenir aux anciennes valeurs
    setIsEditing(false)
  }

  const handleChange = (field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (event) => {
    event.preventDefault() // Empêche le rechargement de la page

    try {
      // Vérifier si l'email a été modifié
      if (userProfile.email !== user.email) {
        console.log("🔍 Vérification de l'email :", userProfile.email)

        // Récupérer tous les utilisateurs
        const usersResponse = await axiosInstance.get(
          `http://localhost:5000/api/users`
        )
        const users = usersResponse.data || []

        // Vérifier si l'email existe déjà pour un autre utilisateur
        const emailExists = users.some(
          (u) => u.email === userProfile.email && u._id !== user._id
        )

        if (emailExists) {
          console.warn("⚠️ Email déjà utilisé :", userProfile.email)
          setAlertMessage("Cette adresse e-mail est déjà utilisée.")
          setSeverity("error") // Affiche une alerte en rouge
          setAlertOpen(true)
          return
        }
      }

      // Procéder à la mise à jour si l'email est valide
      console.log("✅ Mise à jour de l'utilisateur :", userProfile)

      const result = await dispatch(
        updateUser({
          userId: user._id,
          updatedFields: userProfile,
        })
      )

      dispatch(fetchUserProfile())

      if (result.error) {
        console.error("❌ Erreur lors de la mise à jour :", result.error)
        setAlertMessage(result.error.message || "Une erreur est survenue.")
        setSeverity("error") // Affiche une alerte en rouge
        setAlertOpen(true)
      } else {
        console.log("🎉 Mise à jour réussie !")
        setAlertMessage("Mise à jour réussie !")
        setSeverity("success") // Affiche une alerte en vert
        setAlertOpen(true)
        setIsEditing(false) // Désactiver le mode édition
      }
    } catch (error) {
      console.error("🔥 Erreur lors de la mise à jour :", error)
      setAlertMessage("Erreur de mise à jour.")
      setSeverity("error")
      setAlertOpen(true)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Profil Utilisateur
      </Typography>

      {Object.keys(userProfile).map(
        (field) =>
          field !== "adresse" && (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              variant="outlined"
              fullWidth
              type={field === "email" ? "email" : "text"}
              sx={{ pointerEvents: isEditing ? "auto" : "none" }}
              value={userProfile[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              error={
                field === "email" &&
                userProfile.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)
              }
              helperText={
                field === "email" &&
                userProfile.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)
                  ? "Veuillez entrer un email valide"
                  : ""
              }
            />
          )
      )}

      {user?.role_id === roleUser && (
        <>
          <TextField
            label="Adresse"
            variant="outlined"
            fullWidth
            value={user?.adresse || ""}
            tabIndex={-1}
            sx={{ pointerEvents: "none" }}
          />
          <TextField
            label="Point de vente"
            variant="outlined"
            fullWidth
            tabIndex={-1}
            sx={{ pointerEvents: "none" }}
            value={salePoint?.nom || ""}
          />
        </>
      )}

      {/* Boutons Modifier / Annuler / Enregistrer */}
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        {isEditing ? (
          <>
            <Button variant="contained" color="success" onClick={handleSave}>
              Confirmer
            </Button>
            <Button variant="contained" color="error" onClick={handleCancel}>
              Annuler
            </Button>
          </>
        ) : (
          <Button variant="contained" color="primary" onClick={handleEdit}>
            Modifier
          </Button>
        )}
      </Box>

      {/* Alerte MUI pour afficher un message de succès ou d'erreur */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={4000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Profile
