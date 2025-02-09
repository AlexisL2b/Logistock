import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  FormHelperText,
} from "@mui/material"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
}

export default function BasicModal({
  open,
  onClose,
  onSubmit,
  title = "Modifier l'élément",
  objectData = {},
  dropdownData = {},
}) {
  const [formData, setFormData] = useState(objectData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const initialData = objectData || {}
    setFormData(initialData)
    setErrors({})
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    // Nettoyer l'erreur lorsqu'on commence à taper
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }))
  }

  // 🔍 Fonction de validation des champs
  const validateFields = () => {
    let newErrors = {}

    // Vérifier les champs obligatoires
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "_id") {
        newErrors[key] = "Ce champ est obligatoire."
      }
    })

    // Vérification spécifique des nombres (prix, quantité)
    if (formData.prix && (isNaN(formData.prix) || formData.prix <= 0)) {
      newErrors.prix = "Le prix doit être un nombre positif."
    }

    if (
      formData.quantite_disponible &&
      (isNaN(formData.quantite_disponible) || formData.quantite_disponible < 1)
    ) {
      newErrors.quantite_disponible = "La quantité doit être un entier positif."
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0 // ✅ Retourne true si tout est valide
  }

  const handleSubmit = () => {
    if (validateFields()) {
      onSubmit(formData) // Envoie les données si elles sont valides
      onClose() // Ferme la modal
    }
  }

  const findDropdownKey = (key) => {
    const keyMapping = {
      categorie_id: "/categories",
      fournisseur_id: "/suppliers",
    }
    return keyMapping[key] || null
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title">
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {Object.keys(formData)
            .filter((key) => key !== "_id" && key !== "__v")
            .map((key) => {
              const dropdownKey = findDropdownKey(key)

              if (key.endsWith("_id") && dropdownData[dropdownKey]) {
                return (
                  <TextField
                    select
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors[key]}
                    helperText={errors[key]}
                  >
                    {dropdownData[dropdownKey]?.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.nom}
                      </MenuItem>
                    ))}
                  </TextField>
                )
              } else if (key.endsWith("_id")) {
                return (
                  <TextField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    value="Clé manquante dans dropdownData"
                    disabled
                    fullWidth
                  />
                )
              }

              return (
                <TextField
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors[key]}
                  helperText={errors[key]}
                />
              )
            })}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

BasicModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  objectData: PropTypes.object,
  dropdownData: PropTypes.object,
}
