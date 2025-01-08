import { useEffect, useState } from "react"
import { Box } from "@mui/material"
import axiosInstance from "../../../../axiosConfig"
import EnhancedTableDependancies from "../../../reusable-ui/EnhancedTableDependancies"

export default function products() {
  const [products, setProducts] = useState([])

  // Fonction pour recharger les données
  const fetchProducts = () => {
    axiosInstance
      .get("/products") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setProducts(response.data) // Mise à jour des Produits dans le state
        console.log("Produits récupérées :", response.data)
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des Produits :", error)
      })
  }

  // Chargement initial des Produits
  useEffect(() => {
    fetchProducts()
  }, [])

  // Callback pour gérer les changements de données
  const handleDataChange = () => {
    console.log("Les données ont changé, rechargement...")
    fetchProducts() // Rechargez les données lorsque le callback est déclenché
  }
  const headerMapping = {
    supplier_id: "Fournisseur",
    categorie_id: "Categorie",
    quantite_stock: "Quantité",
  }

  return (
    <Box>
      <EnhancedTableDependancies
        data={products}
        coll={"products"}
        onDataChange={handleDataChange}
        endpoints={["/categories", "/suppliers"]}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
