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
  formStructure = {},
}) {
  const [formData, setFormData] = useState(objectData)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setFormData(objectData || {})
    setErrors({})
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }))
  }

  // 🔍 Fonction de validation dynamique
  const validateFields = () => {
    let newErrors = {}

    Object.keys(formStructure).forEach((key) => {
      if (formStructure[key].required && !formData[key]) {
        newErrors[key] = "Ce champ est obligatoire."
      }

      if (formStructure[key].type === "number") {
        const numValue = parseFloat(formData[key])
        if (isNaN(numValue) || numValue < 0) {
          newErrors[key] = "Veuillez entrer un nombre valide."
        }
      }

      if (formStructure[key].type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData[key])) {
          newErrors[key] = "Veuillez entrer un email valide."
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateFields()) {
      console.log("formData", formData)
      onSubmit(formData)
      onClose()
    }
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
          {Object.keys(formStructure).map((key) => {
            const field = formStructure[key]
            console.log("field log //////////////", field)
            // 🔹 Si c'est un champ de type `select`
            if (field.type === "select" && dropdownData[key]) {
              return (
                <TextField
                  select
                  key={key}
                  label={field.label}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors[key]}
                  helperText={errors[key]}
                >
                  {dropdownData[key].map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.nom}
                    </MenuItem>
                  ))}
                </TextField>
              )
            }

            // 🔹 Si c'est un champ standard (text, number, email, etc.)
            return (
              <TextField
                key={key}
                label={field.label}
                name={key}
                type={field.type}
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
  formStructure: PropTypes.object.isRequired, // 🔥 La structure du formulaire est obligatoire
}
