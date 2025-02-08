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
    price: "",
    quantite_disponible: "",
    category_id: "",
    supplier_id: "",
    sales_point_id: "",
  })

  useEffect(() => {
    if (objectData) {
      setFormData({
        name: objectData.name || "",
        reference: objectData.reference || "",
        price: objectData.price || "",
        quantite_disponible: objectData.quantite_disponible || "",
        category_id: objectData.category_id?._id || "",
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

  const handleSubmit = () => {
    onSubmit(formData)
    // onClose()
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
          {/* Nom */}
          <TextField
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Référence */}
          <TextField
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Prix */}
          <TextField
            label="Prix"
            name="prix"
            type="number"
            value={formData.prix}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, "") // 🔥 Empêche tout sauf les chiffres et le point
            }}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Quantité Disponible */}
          <TextField
            label="Quantité Disponible"
            name="quantite_disponible"
            type="number"
            value={formData.quantite_disponible}
            onChange={handleInputChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "") // 🔥 Empêche tout sauf les chiffres et le point
            }}
            fullWidth
            sx={{ mb: 2 }}
          />

          {/* Catégorie */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              name="categorie_id"
              value={formData.categorie_id}
              onChange={handleInputChange}
            >
              {dropdownData["/categories"] &&
              dropdownData["/categories"].length > 0 ? (
                dropdownData["/categories"].map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucune catégorie disponible</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Fournisseur */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Fournisseur</InputLabel>
            <Select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleInputChange}
            >
              {dropdownData["/suppliers"] &&
              dropdownData["/suppliers"].length > 0 ? (
                dropdownData["/suppliers"].map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun fournisseur disponible</MenuItem>
              )}
            </Select>
          </FormControl>

          {/* Point de Vente */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="sales-point-label">Point de Vente</InputLabel>
            <Select
              labelId="sales-point-label"
              id="sales-point-select"
              name="sales_point_id"
              value={formData.sales_point_id}
              onChange={handleInputChange}
            >
              {dropdownData["/sales_points"] &&
              dropdownData["/sales_points"].length > 0 ? (
                dropdownData["/sales_points"].map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.nom}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Aucun point de vente disponible</MenuItem>
              )}
            </Select>
            <FormHelperText>Sélectionnez un point de vente</FormHelperText>
          </FormControl>

          {/* Bouton d'enregistrement */}
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
