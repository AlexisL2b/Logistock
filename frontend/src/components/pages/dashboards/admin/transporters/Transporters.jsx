import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import axiosInstance from "../../../../axiosConfig"
import EnhancedTable from "../../../reusable-ui/EnhancedTable"

export default function transporters() {
  const [transporters, setTransporters] = useState([])

  // Fonction pour recharger les données
  const fetchTransporters = () => {
    axiosInstance
      .get("/transporters") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setTransporters(response.data.data) // Mise à jour des fournisseurs dans le state
        console.log("Fournisseur récupérées :", response.data.data)
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
    fetchTransporters()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    console.log("Les données ont changé, rechargement...")
    fetchTransporters() // Rechargez les données lorsque le callback est déclenché
  }

  return (
    <Box>
      <EnhancedTable
        data={transporters}
        coll={"transporters"}
        onDataChange={handleDataChange}
        headerMapping={{}}
      />
    </Box>
  )
}
