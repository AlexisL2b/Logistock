import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material"
import axiosInstance from "../../../axiosConfig"
import CustomSelect from "../../reusable-ui/CustomSelect"

const FormulaireInscription = ({ admin, onClose, onUserAdded }) => {
  const [salesPoints, setSalesPoints] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState("") // Stocke le rôle sélectionné
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch("password")

  useEffect(() => {
    const fetchSalesPoints = async () => {
      try {
        const response = await axiosInstance.get("/sales_points")
        setSalesPoints(response.data || [])
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des Points de ventes :",
          error
        )
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles")
        setRoles(response.data || [])
      } catch (error) {
        console.error("Erreur lors de la récupération des Rôles :", error)
      }
    }

    fetchSalesPoints()
    fetchRoles()
  }, [])

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...userData } = data
      await axiosInstance.post("http://localhost:5000/api/users", userData)
      setSnackbar({
        open: true,
        message: "Inscription réussie !",
        severity: "success",
      })
      onUserAdded()
      onClose()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Une erreur est survenue.",
        severity: "error",
      })
    }
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Prénom */}
          <Grid item xs={12}>
            <Controller
              name="firstname"
              control={control}
              defaultValue=""
              rules={{ required: "Le prénom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prénom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.firstname}
                  helperText={errors.firstname?.message}
                />
              )}
            />
          </Grid>

          {/* Nom */}
          <Grid item xs={12}>
            <Controller
              name="lastname"
              control={control}
              defaultValue=""
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  error={!!errors.lastname}
                  helperText={errors.lastname?.message}
                />
              )}
            />
          </Grid>

          {/* Adresse */}
          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              defaultValue=""
              rules={{ required: "L'adresse est requise" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adresse"
                  variant="outlined"
                  fullWidth
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: "L'email est requis",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ ]+$/,
                  message: "Email invalide",
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

          {/* Mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: "Le mot de passe est requis",
                validate: (value) => {
                  if (value.length < 12) return "Min. 12 caractères"
                  if (!/[A-Z]/.test(value)) return "Une majuscule requise"
                  if (!/[a-z]/.test(value)) return "Une minuscule requise"
                  if (!/[0-9]/.test(value)) return "Un chiffre requis"
                  if (!/[!@#$%^&*]/.test(value))
                    return "Un caractère spécial requis"
                  return true
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

          {/* Confirmation du mot de passe */}
          <Grid item xs={12}>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: "Confirmez votre mot de passe",
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

          {/* Sélecteur de rôle (admin uniquement) */}
          {admin && (
            <Grid item xs={12}>
              <Controller
                name="role_id"
                control={control}
                defaultValue=""
                rules={{ required: "Veuillez sélectionner un rôle" }}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      inputLabelId="roles-label"
                      inputLabel="Rôle"
                      selectId="roles-select"
                      selectLabel="Rôle"
                      defaultMenuItemLabel="Sélectionner un rôle"
                      menuItems={roles}
                      selectedValue={field.value}
                      onChange={(e) => {
                        field.onChange(e)
                        setSelectedRole(
                          roles.find((role) => role._id === e.target.value)
                        )
                      }}
                    />
                    <FormHelperText error={!!errors.role_id}>
                      {errors.role_id?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
          )}

          {/* Sélecteur de point de vente */}
          {(selectedRole?.name === "Acheteur" || !admin) && (
            <Grid item xs={12}>
              <Controller
                name="sale_point_id"
                control={control}
                defaultValue=""
                rules={{ required: "Veuillez sélectionner un point de vente" }}
                render={({ field }) => (
                  <>
                    <CustomSelect
                      inputLabelId="sales-point-label"
                      inputLabel="Point de Vente"
                      selectId="sales-point-select"
                      selectLabel="Point de Vente"
                      defaultMenuItemLabel="Sélectionner un point de vente"
                      menuItems={salesPoints}
                      selectedValue={field.value}
                      onChange={(e) => field.onChange(e)}
                    />
                    <FormHelperText error={!!errors.sale_point_id}>
                      {errors.sale_point_id?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
          )}

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
