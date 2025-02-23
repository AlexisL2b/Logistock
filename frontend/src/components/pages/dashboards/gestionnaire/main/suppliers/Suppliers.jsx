import { useEffect, useState } from "react"
import { Box, TextField, Typography } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/tables/EnhancedTable"

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const fields = {
    name: { type: "text", label: "Nom", required: true },
    phone: { type: "tel", label: "Telephone", required: true },
    email: { type: "email", label: "Email", required: true },
    contact: { type: "text", label: "Contact", required: true },
  }

  // Fonction pour recharger les données
  const fetchSuppliers = () => {
    axiosInstance
      .get("/suppliers") // URL correcte pour récupérer les fournisseurs
      .then((response) => {
        setSuppliers(response.data) // Mise à jour du state avec les fournisseurs
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des fournisseurs :",
          error
        )
      })
  }

  // Chargement initial des fournisseurs
  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    fetchSuppliers() // Recharge les données lorsqu'un changement est détecté
  }

  const headerMapping = {
    _id: "ID",
    nom: "Nom",
    email: "Email",
    telephone: "Téléphone",
  }

  console.log("data: ", suppliers)

  // 🔍 Filtrage multi-critères : Nom, ID, Email, Téléphone
  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      supplier.name.toLowerCase().includes(searchLower) || // Nom du fournisseur
      supplier._id.toLowerCase().includes(searchLower) || // ID du fournisseur
      (supplier.email && supplier.email.toLowerCase().includes(searchLower)) || // Email
      (supplier.telephone && supplier.telephone.includes(searchLower)) // Téléphone
    )
  })

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Fournisseurs
      </Typography>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Email, Téléphone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les fournisseurs filtrés à EnhancedTable */}
      <EnhancedTable
        formStructure={fields}
        data={filteredSuppliers}
        coll={"suppliers"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
