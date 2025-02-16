import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchUserProfile,
  setUser,
} from "../../../../../../redux/slices/authSlice"
import {
  Box,
  TextField,
  Snackbar,
  Alert,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material"
import { fetchSalesPoints } from "../../../../../../redux/slices/salesPointSlice"
import { fetchRoles } from "../../../../../../redux/slices/roleSlice"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import axiosInstance from "../../../../../../axiosConfig"

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { salesPoints } = useSelector((state) => state.salesPoints)

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [severity, setSeverity] = useState("info")

  const [userProfile, setUserProfile] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
    address: user?.address || "",
  })
  const roleUser = "677cf977b39853e4a17727e3"

  useEffect(() => {
    dispatch(fetchSalesPoints())
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    setUserProfile({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      address: user?.address || "",
    })
  }, [user])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setUserProfile({
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      email: user?.email || "",
      address: user?.address || "",
    })
    setIsEditing(false)
    setErrors({})
  }

  const handleChange = (field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }))
  }

  const validateFields = () => {
    let newErrors = {}
    Object.keys(userProfile).forEach((field) => {
      if (!userProfile[field]) {
        newErrors[field] = "Ce champ est obligatoire."
      }
    })

    if (
      userProfile.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)
    ) {
      newErrors.email = "Veuillez entrer un email valide."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateFields()) return
    setIsLoading(true)

    try {
      console.log("🚀 Envoi des modifications utilisateur...")

      const updatedFields = {}
      Object.keys(userProfile).forEach((key) => {
        if (userProfile[key] !== user[key]) {
          updatedFields[key] = userProfile[key]
        }
      })

      if (Object.keys(updatedFields).length === 0) {
        setAlertMessage("Aucune modification détectée.")
        setSeverity("info")
        setAlertOpen(true)
        setIsLoading(false)
        return
      }

      const response = await axiosInstance.put(
        `/users/${user._id}`,
        updatedFields,
        { withCredentials: true }
      )

      console.log("✅ Réponse mise à jour :", response.data)

      const updatedUser = response.data.user
      if (updatedUser) {
        dispatch(setUser(updatedUser))
        setUserProfile(updatedUser)
      }

      setAlertMessage("Mise à jour réussie !")
      setSeverity("success")
      setIsEditing(false)
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error)
      setAlertMessage("Erreur de mise à jour.")
      setSeverity("error")
    }

    setIsLoading(false)
    setAlertOpen(true)
  }

  // 🔹 Dictionnaire des labels en français
  const fieldLabels = {
    firstname: "Prénom",
    lastname: "Nom",
    email: "Email",
    address: "Adresse",
  }

  return (
    <Box
      sx={{
        maxWidth: "600px",
        mx: "auto",
        mt: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" gutterBottom align="center">
        Profil Utilisateur
      </Typography>

      {Object.keys(userProfile).map((field) => (
        <TextField
          key={field}
          label={fieldLabels[field]} // 🔹 Utilise les labels en français
          variant="outlined"
          fullWidth
          type={field === "email" ? "email" : "text"}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: isEditing ? "white" : "rgba(0, 0, 0, 0.04)",
              pointerEvents: isEditing ? "auto" : "none",
            },
          }}
          value={userProfile[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          error={Boolean(errors[field])}
          helperText={errors[field] || ""}
        />
      ))}

      {user?.role_id === roleUser && (
        <>
          <TextField
            label="Adresse"
            variant="outlined"
            fullWidth
            value={user?.address || ""}
            disabled
          />
          <TextField
            label="Point de vente"
            variant="outlined"
            fullWidth
            value={
              salesPoints?.find((s) => s._id === user?.point_vente_id)?.nom ||
              ""
            }
            disabled
          />
        </>
      )}

      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Confirmer"}
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Annuler
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleEdit}>
            Modifier
          </Button>
        )}
      </Box>

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
