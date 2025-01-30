import { useEffect, useState } from "react"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/EnhancedTableDependancies"

export default function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fonction pour recharger les données
  const fetchProducts = () => {
    axiosInstance
      .get("/products") // URL relative correcte si axiosInstance est bien configuré
      .then((response) => {
        setProducts(response.data) // Mise à jour des Produits dans le state
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
    fetchProducts() // Recharge les données lorsque le callback est déclenché
  }

  const headerMapping = {
    supplier_id: "Fournisseur",
    categorie_id: "Categorie",
    quantite_stock: "Quantité",
    ref: "Référence",
  }

  console.log("data: ", products)
  console.log("endpoints: ", ["/categories", "/suppliers"])
  console.log("headerMapping", headerMapping)

  // 🔍 Filtrage multi-critères : Nom, ID, Catégorie, Fournisseur, Référence
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase()

    return (
      product.nom.toLowerCase().includes(searchLower) || // Nom du produit
      product._id.toLowerCase().includes(searchLower) || // ID du produit
      (product.categorie_id?.nom &&
        product.categorie_id.nom.toLowerCase().includes(searchLower)) || // Catégorie
      (product.supplier_id?.nom &&
        product.supplier_id.nom.toLowerCase().includes(searchLower)) || // Fournisseur
      (product.ref && product.ref.toLowerCase().includes(searchLower)) // Référence
    )
  })

  return (
    <Box>
      {/* 🔍 Champ de recherche multi-critères */}
      <TextField
        label="Rechercher par Nom, ID, Catégorie, Fournisseur, Référence"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Passe les produits filtrés à EnhancedTableDependancies */}
      <EnhancedTableDependancies
        data={filteredProducts}
        coll={"products"}
        onDataChange={handleDataChange}
        endpoints={["/categories", "/suppliers"]}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
