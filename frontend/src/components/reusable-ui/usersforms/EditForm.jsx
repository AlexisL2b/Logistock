import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  TextField,
  Button,
  Grid,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { updateUserInfo } from "../../../redux/slices/userSlice"
import CustomSelect from "../selects/CustomSelect"

const EditForm = ({ row, onClose, onUserUpdated }) => {
  const dispatch = useDispatch()
  const salesPoints = useSelector((state) => state.salesPoints.list)
  const roles = useSelector((state) => state.roles.list)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (row) {
      reset({
        nom: row.nom || "",
        prenom: row.prenom || "",
        adresse: row.adresse || "",
        email: row.email || "",
        role: roles.find((role) => role.name === row["rôle"])?._id || "",
        sales_point:
          salesPoints.find((sp) => sp.name === row["point de vente"])?._id ||
          "",
        oldPassword: "",
        newPassword: "",
      })
    }
  }, [row, reset, roles, salesPoints])

  const newPassword = watch("newPassword")
  const oldPassword = watch("oldPassword")

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const { oldPassword, newPassword, ...userData } = data
      if (newPassword && !oldPassword) {
        setSnackbar({
          open: true,
          message: "L'ancien mot de passe est requis.",
          severity: "error",
        })
        setIsSubmitting(false)
        return
      }
      console.log("userData", userData)
      const updatedUserData = {
        ...userData,
        role: roles.find((role) => role._id === userData.role),
        sales_point: (() => {
          const sp = salesPoints.find((sp) => sp._id === userData.sales_point)
          return sp ? { _id: sp._id, name: sp.name } : null
        })(),
        password: newPassword ? newPassword : undefined,
        oldPassword: newPassword ? oldPassword : undefined,
      }
      console.log("updatedUserData", updatedUserData)

      await dispatch(
        updateUserInfo({ userId: row._id, userUpdates: updatedUserData })
      )
      setSnackbar({
        open: true,
        message: "Utilisateur mis à jour avec succès !",
        severity: "success",
      })
      onUserUpdated()
      onClose()
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Une erreur est survenue.",
        severity: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto", mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="nom"
              control={control}
              rules={{ required: "Le nom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nom"
                  fullWidth
                  error={!!errors.nom}
                  helperText={errors.nom?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="prenom"
              control={control}
              rules={{ required: "Le prénom est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prénom"
                  fullWidth
                  error={!!errors.prenom}
                  helperText={errors.prenom?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="adresse"
              control={control}
              rules={{ required: "L'adresse est requise" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Adresse"
                  fullWidth
                  error={!!errors.adresse}
                  helperText={errors.adresse?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "L'email est requis" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  inputLabel="Rôle"
                  selectLabel="Rôle"
                  menuItems={roles}
                  selectedValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="sales_point"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  inputLabel="Point de Vente"
                  selectLabel="Point de Vente"
                  menuItems={salesPoints}
                  selectedValue={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  // {...field}
                  label="Ancien Mot de Passe"
                  type="password"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nouveau Mot de Passe"
                  type="password"
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Modifier"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  )
}

export default EditForm
