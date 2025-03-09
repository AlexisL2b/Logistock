import {
  Box,
  Button,
  Typography,
  Grid,
  Stack,
  useMediaQuery,
  useTheme,
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
import CustomSelect from "../../../../../reusable-ui/selects/CustomSelect"

export default function Stocks() {
  const dispatch = useDispatch()
  const stocks = useSelector((state) => state.stocks.stocksProducts || [])

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [suppliers, setSuppliers] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState("")

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

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

  useEffect(() => {
    const socket = io("http://localhost:5000")

    socket.on("stocksUpdated", (updatedStocks) => {
      console.log(
        "🟢 Mise à jour des stocks reçue via WebSocket :",
        updatedStocks
      )

      if (!Array.isArray(updatedStocks)) {
        console.error("❌ Format incorrect de stocksUpdated :", updatedStocks)
        return
      }

      updatedStocks.forEach((stock) => {
        if (!stock.stockId || !stock.quantity) {
          console.error("❌ Données manquantes dans le stock reçu :", stock)
          return
        }
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
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          mb: 2,
          flexDirection: isSmallScreen ? "column" : "row",
        }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <CustomSelect
            inputLabelId="filtreCategorieLabel"
            inputLabel="Filtrer par Catégorie"
            selectId="filtreCategorie"
            selectLabel="Filtrer par Catégorie"
            defaultMenuItemLabel="Toutes les catégories"
            menuItems={categories}
            selectedValue={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <CustomSelect
            inputLabelId="filtreFournisseurLabel"
            inputLabel="Filtrer par Fournisseur"
            selectId="filtreFournisseur"
            selectLabel="Filtrer par Fournisseur"
            defaultMenuItemLabel="Tous les fournisseurs"
            menuItems={suppliers}
            selectedValue={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                setSelectedCategory("")
                setSelectedSupplier("")
              }}
              fullWidth={isSmallScreen}
            >
              Réinitialiser
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Affichage des stocks */}
      <Box
        sx={{
          mt: 2,
          p: { xs: 1, md: 2 },
          width: "100%",
          overflowX: "auto", // Permet de scroller sur petits écrans
        }}
      >
        {filteredStocks.length > 0 ? (
          <StocksTable stocks={filteredStocks} />
        ) : (
          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "text.secondary",
            }}
          >
            Aucun stock disponible.
          </Typography>
        )}
      </Box>
    </Box>
  )
}
