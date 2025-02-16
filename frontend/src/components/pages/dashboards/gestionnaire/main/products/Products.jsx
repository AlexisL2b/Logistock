import { useEffect, useState } from "react"
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import EnhancedTableDependancies from "../../../../../reusable-ui/EnhancedTableDependancies"
import CustomSelect from "../../../../../reusable-ui/CustomSelect"

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [age, setAge] = useState("")

  // Fonction pour charger les produits
  const fetchProducts = () => {
    axiosInstance
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des Produits :", error)
      )
  }

  // Fonction pour charger les catégories
  const fetchCategories = () => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      )
  }

  // Fonction pour charger les fournisseurs
  const fetchSuppliers = () => {
    axiosInstance
      .get("/suppliers")
      .then((response) => setSuppliers(response.data))
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des fournisseurs :",
          error
        )
      )
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchSuppliers()
  }, [])

  const handleDataChange = () => {
    fetchProducts()
  }

  console.log(products)

  const headerMapping = {
    supplier_id: "Fournisseur",
    category_id: "Categorie",
    // quantity: "Quantité",
    price: "Prix",
    reference: "Référence",
  }

  // 🔍 **Filtrage des produits par recherche, catégorie et fournisseur**
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase()
    // Vérification du filtre de recherche
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product._id.toLowerCase().includes(searchLower) ||
      (product.category_id?.name &&
        product.category_id.name.toLowerCase().includes(searchLower)) ||
      (product.supplier_id?.name &&
        product.supplier_id.name.toLowerCase().includes(searchLower)) ||
      (product.reference &&
        product.reference.toLowerCase().includes(searchLower))

    // Vérification du filtre par catégorie
    const matchesCategory =
      selectedCategory === "" || product.category_id?._id === selectedCategory

    // Vérification du filtre par fournisseur
    const matchesSupplier =
      selectedSupplier === "" || product.supplier_id?._id === selectedSupplier

    return matchesSearch && matchesCategory && matchesSupplier
  })
  const handleChange = (event) => {
    setAge(event.target.value)
  }
  return (
    <Box>
      {/* 🔍 Barre de recherche multi-critères */}
      <TextField
        label="Rechercher par name, ID, Catégorie, Fournisseur, Référence"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <CustomSelect
          inputLabelId="filtreCategorieLabel"
          inputLabel="Filtrer par Catégorie"
          selectId="filtreCategorie"
          selectLabel="Filtrer par Catégorie"
          defaultMenuItemLabel="Toutes les catégories"
          menuItems={categories}
          selectedValue={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        />
        <CustomSelect
          inputLabelId="filtreCategorieLabel"
          inputLabel="Filtrer par Fournisseur"
          selectId="filtreCategorie"
          selectLabel="Filtrer par Fournisseur"
          defaultMenuItemLabel="Tous les fournisseurs"
          menuItems={suppliers}
          selectedValue={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        />

        {/* 🔄 Bouton de réinitialisation */}
        <Button
          sx={{ width: "300px" }}
          variant="contained"
          onClick={() => {
            setSelectedCategory("")
            setSelectedSupplier("")
            setSearchTerm("")
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* 📊 Affichage des produits filtrés */}
      <EnhancedTableDependancies
        data={filteredProducts}
        coll={"products"}
        onDataChange={handleDataChange}
        endpoints={["/categories", "/suppliers", "/sales_points"]}
        headerMapping={headerMapping}
      />
    </Box>
  )
}
