import {
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import StocksTable from "./StocksTable"
import { useDispatch, useSelector } from "react-redux"
import { fetchStocksWithProduct } from "../../../../../../redux/slices/stockSlice"
import axiosInstance from "../../../../../../axiosConfig"

export default function Stocks() {
  const stocks = useSelector((state) => state.stocks)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchStocksWithProduct())
  }, [])

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((response) => setCategories(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      )
  }, [])

  useEffect(() => {
    axiosInstance
      .get("/suppliers")
      .then((response) => setSuppliers(response.data))
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des fournisseurs :",
          error
        )
      )
  }, [])

  const refreshStocks = () => {
    dispatch(fetchStocksWithProduct())
  }

  // Filtrage des stocks en fonction des sélections
  const filteredStocks = stocks.stocksProducts?.filter(
    (stock) =>
      stock.produit_id !== null &&
      (selectedCategory === "" ||
        stock.produit_id.categorie_id._id === selectedCategory) &&
      (selectedSupplier === "" ||
        stock.produit_id.supplier_id._id === selectedSupplier)
  )

  return (
    <Box>
      {/* Filtres alignés proprement */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        {/* Filtre par catégorie */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel
            shrink
            sx={{
              position: "absolute",
              background: "white",
              px: 1,
              mt: -0.5, // Ajuste la hauteur pour éviter l'encadrement
            }}
          >
            Catégorie
          </InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" sx={{ fontSize: "0.85rem" }}>
              Toutes les catégories
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtre par fournisseur */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel
            shrink
            sx={{
              position: "absolute",
              background: "white",
              px: 1,
              mt: -0.5,
            }}
          >
            Fournisseur
          </InputLabel>
          <Select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" sx={{ fontSize: "0.85rem" }}>
              Tous les fournisseurs
            </MenuItem>
            {suppliers.map((sup) => (
              <MenuItem key={sup._id} value={sup._id}>
                {sup.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bouton de réinitialisation (ajusté en hauteur) */}
        <Button
          variant="contained"
          size="small"
          sx={{ height: 40 }} // Ajustement précis de la hauteur
          onClick={() => {
            setSelectedCategory("")
            setSelectedSupplier("")
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Tableau des stocks filtrés */}
      {filteredStocks ? (
        <StocksTable stocks={filteredStocks} onStockUpdated={refreshStocks} />
      ) : (
        <Typography>Aucun stocks !</Typography>
      )}
    </Box>
  )
}
