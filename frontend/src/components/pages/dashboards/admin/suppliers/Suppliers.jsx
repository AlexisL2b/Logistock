import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import axiosInstance from "../../../../axiosConfig"
import EnhancedTable from "../../../reusable-ui/EnhancedTable"

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])

  // Fonction pour recharger les données
  const fetchSuppliers = () => {
    axiosInstance
      .get("/suppliers") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setSuppliers(response.data) // Mise à jour des fournisseurs dans le state
        console.log("Fournisseur récupérées :", response.data)
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
    console.log("Les données ont changé, rechargement...")
    fetchSuppliers() // Rechargez les données lorsque le callback est déclenché
  }

  return (
    <Box>
      <EnhancedTable
        data={suppliers}
        coll={"suppliers"}
        onDataChange={handleDataChange}
        headerMapping={{}}
      />
    </Box>
  )
}
