import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import axiosInstance from "../../../axiosConfig"

import User from "../../../../../backend/models/userModel"

const FormulaireInscription = () => {
  const [salesPoints, setSalesPoints] = useState([]) // State pour stocker les points de vente

  // Initialisation de React Hook Form
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  // Récupérer les points de vente depuis l'API
  useEffect(() => {
    const fetchSalesPoints = () => {
      axiosInstance
        .get("/sales_points") // URL relative correcte si axiosInstance est bien configuré
        .then((response) => {
          setSalesPoints(response.data.data) // Mise à jour des points de vente dans le state
          //("Points de vente récupérés :", response.data.data)
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des points de vente :",
            error
          )
        })
    }

    fetchSalesPoints()
  }, [])
  //("////////////////////", salesPoints)
  // Fonction appelée lors de la soumission du formulaire

  const onSubmit = async (data) => {
    try {
      //("Données soumises :", data)

      // Envoyer les données au backend
      const res = await axiosInstance.post(
        "http://localhost:5000/api/auth/register",
        data
      )

      //("Réponse du backend :", res.data)

      // Afficher un message de succès ou rediriger
      alert("Inscription réussie !")
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error)

      // Afficher un message d'erreur à l'utilisateur
      alert("Une erreur est survenue. Veuillez réessayer.")
    }
  }
  // Récupérer la valeur actuelle du mot de passe pour la validation de confirmation
  const password = watch("password")

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inscription
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Champ Prénom */}
          <Grid item xs={12}>
            <Controller
              name="prenom"
              control={control}
              defaultValue=""
              rules={{ required: "Le prénom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prénom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Nom */}
          <Grid item xs={12}>
            <Controller
              name="nom"
              control={control}
              defaultValue=""
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Adresse */}
          <Grid item xs={12}>
            <Controller
              name="adresse"
              control={control}
              defaultValue=""
              rules={{ required: "L'adresse est requise" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adresse"
                  variant="outlined"
                  fullWidth
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Email */}
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "L'email est requis",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "Veuillez entrer un email valide",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Mot de passe */}
          {/* Champ Mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "Le mot de passe est requis",
                validate: (value) => {
                  // Vérification de la longueur minimale
                  if (value.length < 12) {
                    return "Le mot de passe doit contenir au moins 12 caractères"
                  }

                  // Vérification des types de caractères
                  const hasUpperCase = /[A-Z]/.test(value) // Lettres majuscules
                  const hasLowerCase = /[a-z]/.test(value) // Lettres minuscules
                  const hasNumber = /[0-9]/.test(value) // Chiffres
                  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value) // Caractères spéciaux

                  if (!hasUpperCase) {
                    return "Le mot de passe doit contenir au moins une lettre majuscule"
                  }
                  if (!hasLowerCase) {
                    return "Le mot de passe doit contenir au moins une lettre minuscule"
                  }
                  if (!hasNumber) {
                    return "Le mot de passe doit contenir au moins un chiffre"
                  }
                  if (!hasSpecialChar) {
                    return "Le mot de passe doit contenir au moins un caractère spécial"
                  }

                  return true // Valide si toutes les conditions sont remplies
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Grid>

          {/* Champ Confirmation de mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "La confirmation du mot de passe est requise",
                validate: (value) =>
                  value === password ||
                  "Les mots de passe ne correspondent pas",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirmer le mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
          </Grid>

          {/* DropDown pour les points de vente */}
          <Grid item xs={12}>
            <Controller
              name="salesPoint"
              control={control}
              defaultValue=""
              rules={{ required: "Veuillez sélectionner un point de vente" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.salesPoint}>
                  <InputLabel id="sales-point-label">Point de Vente</InputLabel>
                  <Select
                    {...field}
                    labelId="sales-point-label"
                    label="Point de Vente"
                  >
                    {salesPoints.map((point) => (
                      <MenuItem key={point._id} value={point._id}>
                        {point.nom}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.salesPoint && (
                    <Typography color="error" variant="body2">
                      {errors.salesPoint.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Checkbox pour accepter les conditions */}
          <Grid item xs={12}>
            <Controller
              name="conditions"
              control={control}
              defaultValue={false}
              rules={{
                required: "Vous devez accepter les conditions d'utilisation",
              }}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value} // Spécifie la valeur de la checkbox
                    />
                  }
                  label="J'accepte les conditions d'utilisation"
                />
              )}
            />
            {errors.conditions && (
              <Typography color="error" variant="body2">
                {errors.conditions.message}
              </Typography>
            )}
          </Grid>

          {/* Bouton Soumettre */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              S'inscrire
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default FormulaireInscription
