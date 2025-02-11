import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
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
  const [formData, setFormData] = useState({
    name: "",
    reference: "",
    prix: "",
    quantite_disponible: "",
    description: "", // ✅ Ajout de la description
    categorie_id: "",
    supplier_id: "",
    sales_point_id: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (objectData) {
      setFormData({
        name: objectData.nom || "",
        reference: objectData.reference || "",
        prix: objectData.prix || "",
        quantite_disponible: objectData.quantite_disponible || "",
        description: objectData.description || "", // ✅ Remplissage si disponible
        categorie_id: objectData.categorie_id?._id || "",
        supplier_id: objectData.supplier_id?._id || "",
        sales_point_id: objectData.sales_point_id || "",
      })
    }
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const validateForm = () => {
    let newErrors = {}

    if (!formData.nom.trim()) newErrors.nom = "Le nom est obligatoire."
    if (!formData.reference.trim())
      newErrors.reference = "La référence est obligatoire."
    if (!formData.prix || formData.prix <= 0)
      newErrors.prix = "Le prix doit être supérieur à 0."
    if (!formData.quantite_disponible || formData.quantite_disponible <= 0)
      newErrors.quantite_disponible = "Quantité invalide."
    if (!formData.description.trim())
      newErrors.description = "La description est obligatoire." // ✅ Ajout validation description
    if (!formData.categorie_id)
      newErrors.categorie_id = "Veuillez sélectionner une catégorie."
    if (!formData.supplier_id)
      newErrors.supplier_id = "Veuillez sélectionner un fournisseur."
    if (!formData.sales_point_id)
      newErrors.sales_point_id = "Veuillez sélectionner un point de vente."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
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
          {/* 🔥 Nom */}
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            error={!!errors.nom}
            helperText={errors.nom}
            fullWidth
          />

          {/* 🔥 Référence */}
          <TextField
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            error={!!errors.reference}
            helperText={errors.reference}
            fullWidth
          />

          {/* 🔥 Prix */}
          <TextField
            label="Prix"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleInputChange}
            error={!!errors.prix}
            helperText={errors.prix}
            fullWidth
          />

          {/* 🔥 Quantité Disponible */}
          <TextField
            label="Quantité Disponible"
            name="quantite_disponible"
            type="number"
            value={formData.quantite_disponible}
            onChange={handleInputChange}
            error={!!errors.quantite_disponible}
            helperText={errors.quantite_disponible}
            fullWidth
          />

          {/* 🔥 Description */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline // ✅ Permet plusieurs lignes
            rows={3} // ✅ Définit la hauteur initiale
          />

          {/* 🔥 Catégorie */}
          <FormControl fullWidth error={!!errors.categorie_id}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie_id"
              value={formData.categorie_id}
              onChange={handleInputChange}
            >
              {dropdownData["/categories"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.categorie_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Fournisseur */}
          <FormControl fullWidth error={!!errors.supplier_id}>
            <InputLabel>Fournisseur</InputLabel>
            <Select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleInputChange}
            >
              {dropdownData["/suppliers"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.supplier_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Point de Vente */}
          <FormControl fullWidth error={!!errors.sales_point_id}>
            <InputLabel>Point de Vente</InputLabel>
            <Select
              name="sales_point_id"
              value={formData.sales_point_id}
              onChange={handleInputChange}
            >
              {dropdownData["/sales_points"]?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.nom}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.sales_point_id}</FormHelperText>
          </FormControl>

          {/* 🔥 Bouton d'enregistrement */}
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
