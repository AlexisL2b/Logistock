import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrders } from "../../../../../../../../redux/slices/orderSlice"
import { fetchStocks } from "../../../../../../../../redux/slices/stockSlice"
import { Box, TextField } from "@mui/material"
import AwaitingTable from "../../pannels/awaiting/AwaitingTable"
import _ from "lodash" // Import de Lodash
import ConfirmedTable from "./ConfirmedTable"

export default function Confirmed() {
  const dispatch = useDispatch()
  const orders = useSelector((state) => state.orders.list)
  const stocks = useSelector((state) => state.stocks.stocks)
  const [searchTerm, setSearchTerm] = useState("")
  console.log("orders depuis Confirmed.jsx", orders)
  // Références pour stocker les versions précédentes des données
  const prevOrdersRef = useRef(orders)
  const prevStocksRef = useRef(stocks)

  // Charger les données au démarrage
  useEffect(() => {
    dispatch(fetchOrders())
    dispatch(fetchStocks())
  }, [dispatch])

  // 🔄 Rafraîchir les données toutes les 45 secondes avec comparaison
  useEffect(() => {
    const interval = setInterval(() => {
      // Comparer les commandes et les stocks avec leur état précédent
      if (!_.isEqual(orders, prevOrdersRef.current)) {
        console.log("🔄 Mise à jour des commandes détectée")
        dispatch(fetchOrders())
        prevOrdersRef.current = orders // Mettre à jour la référence
      } else {
      }

      if (!_.isEqual(stocks, prevStocksRef.current)) {
        console.log("🔄 Mise à jour des stocks détectée")
        dispatch(fetchStocks())
        prevStocksRef.current = stocks // Mettre à jour la référence
      } else {
      }
    }, 4500) // 45000 ms = 45 secondes

    return () => clearInterval(interval) // Nettoyage à la suppression du composant
  }, [dispatch, orders, stocks])

  console.log("orders", orders)

  const filteredOrders = orders.filter(
    (order) =>
      order.statut === "validée" &&
      order._id.toLowerCase().startsWith(searchTerm.toLowerCase())
  )
  console.log("filteredOrdersfilteredOrdersfilteredOrders", filteredOrders)
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
      <ConfirmedTable data={filteredOrders} />
    </Box>
  )
}
