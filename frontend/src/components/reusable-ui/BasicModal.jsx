import { useState, useEffect } from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Modal from "@mui/material/Modal"
import TextField from "@mui/material/TextField"
import PropTypes from "prop-types"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function BasicModal({
  open,
  onClose,
  onSubmit,
  title = "Modifier l'élément",
  objectData = {},
}) {
  const [formData, setFormData] = useState(objectData)

  useEffect(() => {
    setFormData(objectData) // Mettre à jour les données du formulaire lorsque objectData change
  }, [objectData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData) // Appelle la fonction onSubmit avec les données du formulaire
    onClose()
    console.log(formData) // Ferme la modal après soumission
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          {Object.keys(formData)
            .filter((key) => key !== "_id" && key !== "__v") // Filtrer les clés _id et __v
            .map((key) => (
              <TextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalisation du label
                name={key}
                value={formData[key]} // Affiche la valeur actuelle
                onChange={handleInputChange} // Met à jour l'état local lorsque l'utilisateur modifie le champ
                fullWidth
              />
            ))}
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
  open: PropTypes.bool.isRequired, // Obligatoire
  onClose: PropTypes.func.isRequired, // Obligatoire
  onSubmit: PropTypes.func.isRequired, // Obligatoire
  title: PropTypes.string, // Facultatif (a une valeur par défaut)
  objectData: PropTypes.object, // Facultatif (a une valeur par défaut)
}
