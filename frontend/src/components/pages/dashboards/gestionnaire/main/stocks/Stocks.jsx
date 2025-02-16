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
import {
  fetchStocksWithProduct,
  updateStock,
} from "../../../../../../redux/slices/stockSlice"
import axiosInstance from "../../../../../../axiosConfig"
import { io } from "socket.io-client"

export default function Stocks() {
  const dispatch = useDispatch()
  const stocks = useSelector((state) => state.stocks.stocksProducts || [])

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState("")

  useEffect(() => {
    dispatch(fetchStocksWithProduct()) // Charger les stocks une seule fois
  }, [dispatch])

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

  // Fonction pour écouter WebSocket et mettre à jour Redux
  useEffect(() => {
    const socket = io("http://localhost:5000")

    socket.on("stocksUpdated", (updatedStocks) => {
      console.log(
        "🟢 Mise à jour des stocks reçue via WebSocket :",
        updatedStocks
      )

      // Vérifie si updatedStocks est bien un tableau
      if (!Array.isArray(updatedStocks)) {
        console.error("❌ Format incorrect de stocksUpdated :", updatedStocks)
        return
      }

      updatedStocks.forEach((stock) => {
        if (!stock.stockId || !stock.quantity) {
          console.error("❌ Données manquantes dans le stock reçu :", stock)
          return
        }
        console.log(stock.stockId)
        dispatch(
          updateStock({
            stockId: stock.stockId,
            stockUpdates: { quantity: stock.quantity },
          })
        )
      })
    })

    return () => socket.disconnect()
  }, [dispatch])

  // Filtrage des stocks en fonction des sélections
  const filteredStocks = stocks.filter(
    (stock) =>
      stock.product_id !== null &&
      (selectedCategory === "" ||
        stock.product_id.category_id._id === selectedCategory) &&
      (selectedSupplier === "" ||
        stock.product_id.supplier_id._id === selectedSupplier)
  )

  return (
    <Box>
      {/* Filtres */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        {/* Filtre par catégorie */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel shrink>Catégorie</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Toutes les catégories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtre par fournisseur */}
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel shrink>Fournisseur</InputLabel>
          <Select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Tous les fournisseurs</MenuItem>
            {suppliers.map((sup) => (
              <MenuItem key={sup._id} value={sup._id}>
                {sup.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Bouton de réinitialisation */}
        <Button
          variant="contained"
          onClick={() => {
            setSelectedCategory("")
            setSelectedSupplier("")
          }}
        >
          Réinitialiser
        </Button>
      </Box>

      {/* Affichage des stocks */}
      {filteredStocks.length > 0 ? (
        <StocksTable stocks={filteredStocks} />
      ) : (
        <Typography>Aucun stock disponible.</Typography>
      )}
    </Box>
  )
}
