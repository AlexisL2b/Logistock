import { Box, TextField, Typography } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/EnhancedTable"
import { useEffect, useState } from "react"

export default function SalesPoints() {
  const [salesPoints, setSalesPoints] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour recharger les données
  const fetchSalesPoints = () => {
    axiosInstance
      .get("/sales_points") // URL correcte pour récupérer les points de vente
      .then((response) => {
        console.log("response", response)
        setSalesPoints(response.data) // Mise à jour du state avec les points de vente
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des points de vente :",
          error
        )
      })
  }

  const fields = {
    name: { type: "text", label: "Nom", required: true },
    address: { type: "text", label: "Adresse", required: true },
  }

  // Chargement initial des points de vente
  useEffect(() => {
    fetchSalesPoints()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    fetchSalesPoints() // Recharge les données lorsqu'un changement est détecté
  }

  const headerMapping = {
    _id: "ID",
    name: "Nom",
    address: "Adresse",
    telephone: "Téléphone",
  }

  console.log("data: ", salesPoints)

  // 🔍 Filtrage multi-critères : Nom, ID, Adresse, Téléphone
  const filteredSalesPoints = salesPoints?.filter((salesPoint) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      salesPoint.name.toLowerCase().includes(searchLower) || // Nom du point de vente
      salesPoint._id.toLowerCase().includes(searchLower) || // ID du point de vente
      (salesPoint.address &&
        salesPoint.address.toLowerCase().includes(searchLower)) || // Adresse
      (salesPoint.telephone && salesPoint.telephone.includes(searchLower)) // Téléphone
    )
  })

  console.log(filteredSalesPoints)

  return (
    <Box sx={{ padding: 3 }}>
      {/* 🏷️ Titre principal */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Points de Vente
      </Typography>

      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Adresse, Téléphone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les points de vente filtrés à EnhancedTable */}
      <EnhancedTable
        formStructure={fields}
        data={filteredSalesPoints}
        coll={"sales_points"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
