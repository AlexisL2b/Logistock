import { useEffect, useState } from "react"
import { Box, TextField, Typography } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/EnhancedTable"

export default function Transporters() {
  const [transporters, setTransporters] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour recharger les données
  const fetchTransporters = () => {
    axiosInstance
      .get("/transporters") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setTransporters(response.data.data) // Mise à jour des transporteurs dans le state
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des transporteurs :",
          error
        )
      })
  }

  // Chargement initial des transporteurs
  useEffect(() => {
    fetchTransporters()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    fetchTransporters() // Recharge les données lorsque le callback est déclenché
  }

  const headerMapping = {
    _id: "ID",
    nom: "Nom",
    phone: "Téléphone",
    email: "Email",
  }

  const fields = {
    name: { type: "text", label: "Nom", required: true },
    phone: { type: "tel", label: "phone", required: true },
    email: { type: "email", label: "Email", required: true },
  }
  console.log("data: ", transporters)

  // 🔍 Filtrage multi-critères : Nom, ID, Téléphone, Email
  const filteredTransporters = transporters.filter((transporter) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      transporter.name.toLowerCase().includes(searchLower) || // Nom du transporteur
      transporter._id.toLowerCase().includes(searchLower) || // ID du transporteur
      (transporter.phone && transporter.phone.includes(searchLower)) || // Téléphone
      (transporter.email &&
        transporter.email.toLowerCase().includes(searchLower)) // Email
    )
  })

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Transporteurs
      </Typography>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Téléphone, Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les transporteurs filtrés à EnhancedTable */}
      <EnhancedTable
        formStructure={fields}
        data={filteredTransporters}
        coll={"transporters"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
