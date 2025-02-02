import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"
import { fetchStocks } from "../../../../../../../../redux/slices/stockSlice"
import { Box, TextField } from "@mui/material"
import _ from "lodash" // Import de Lodash
import CancelledTable from "./CancelledTable"

export default function Cancelled() {
  const dispatch = useDispatch()
  const { orders, status, error } = useSelector((state) => state.orders)
  const stocks = useSelector((state) => state.stocks.stocks)
  const [searchTerm, setSearchTerm] = useState("")

  // Références pour stocker les versions précédentes des données
  const prevOrdersRef = useRef(orders)
  const prevStocksRef = useRef(stocks)

  // Charger les données au démarrage
  useEffect(() => {
    dispatch(fetchOrdersWithDetails())
    dispatch(fetchStocks())
  }, [dispatch])

  // 🔄 Rafraîchir les données toutes les 45 secondes avec comparaison
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("🔄 Tentative de rafraîchissement des commandes et stocks...")

      // Comparer les commandes et les stocks avec leur état précédent
      if (!_.isEqual(orders, prevOrdersRef.current)) {
        console.log("🔄 Mise à jour des commandes détectée")
        dispatch(fetchOrdersWithDetails())
        prevOrdersRef.current = orders // Mettre à jour la référence
      } else {
        console.log("✅ Les commandes n'ont pas changé")
      }

      if (!_.isEqual(stocks, prevStocksRef.current)) {
        console.log("🔄 Mise à jour des stocks détectée")
        dispatch(fetchStocks())
        prevStocksRef.current = stocks // Mettre à jour la référence
      } else {
        console.log("✅ Les stocks n'ont pas changé")
      }
    }, 4500) // 45000 ms = 45 secondes

    return () => clearInterval(interval) // Nettoyage à la suppression du composant
  }, [dispatch, orders, stocks])

  console.log("orders", orders)

  const filteredOrders = orders.filter(
    (order) =>
      order.statut === "annulée" &&
      order.order_id.toLowerCase().startsWith(searchTerm.toLowerCase())
  )

  return (
    <Box>
      {/* 🔍 Champ de recherche */}
      <TextField
        label="Rechercher une commande par ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <CancelledTable data={filteredOrders} />
    </Box>
  )
}
