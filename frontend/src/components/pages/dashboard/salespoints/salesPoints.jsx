import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import axiosInstance from "../../../../axiosConfig"
import EnhancedTable from "../../../reusable-ui/EnhancedTable"

export default function salesPoints() {
  const [salesPoints, setSalesPoints] = useState([])

  // Fonction pour recharger les données
  const fetchSalesPoints = () => {
    axiosInstance
      .get("/sales_points ") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setSalesPoints(response.data) // Mise à jour des points de ventes dans le state
        console.log("points de ventes récupérées :", response.data)
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des points de ventes :",
          error
        )
      })
  }

  // Chargement initial des points de ventes
  useEffect(() => {
    fetchSalesPoints()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    console.log("Les données ont changé, rechargement...")
    fetchSalesPoints() // Rechargez les données lorsque le callback est déclenché
  }

  return (
    <Box>
      <EnhancedTable
        data={salesPoints}
        coll={"sales_points"}
        onDataChange={handleDataChange}
        headerMapping={{}}
      />
    </Box>
  )
}
