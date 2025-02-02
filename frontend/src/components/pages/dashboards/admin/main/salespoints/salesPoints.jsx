import { useEffect, useState } from "react"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTable from "../../../../../reusable-ui/EnhancedTable"

export default function SalesPoints() {
  const [salesPoints, setSalesPoints] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour recharger les données
  const fetchSalesPoints = () => {
    axiosInstance
      .get("/sales_points") // URL correcte pour récupérer les points de vente
      .then((response) => {
        setSalesPoints(response.data.data) // Mise à jour du state avec les points de vente
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des points de vente :",
          error
        )
      })
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
    nom: "Nom",
    adresse: "Adresse",
    telephone: "Téléphone",
  }

  console.log("data: ", salesPoints)

  // 🔍 Filtrage multi-critères : Nom, ID, Adresse, Téléphone
  const filteredSalesPoints = salesPoints.filter((salesPoint) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      salesPoint.nom.toLowerCase().includes(searchLower) || // Nom du point de vente
      salesPoint._id.toLowerCase().includes(searchLower) || // ID du point de vente
      (salesPoint.adresse &&
        salesPoint.adresse.toLowerCase().includes(searchLower)) || // Adresse
      (salesPoint.telephone && salesPoint.telephone.includes(searchLower)) // Téléphone
    )
  })

  return (
    <Box>
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
        data={filteredSalesPoints}
        coll={"sales_points"}
        onDataChange={handleDataChange}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
