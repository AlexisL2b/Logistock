import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSupplierOrders } from "../../../../../../../../redux/slices/supplierOrderSlice"
import { Box, TextField } from "@mui/material"
import AwaitingSupplierTable from "./AwaitingSupplierTable"
import _ from "lodash"

export default function AwaitingSupplierOrders() {
  const dispatch = useDispatch()
  const supplierOrders = useSelector((state) => state.supplierOrder.list)
  const [searchTerm, setSearchTerm] = useState("")
  const prevOrdersRef = useRef(supplierOrders)

  // 📦 Charger les commandes fournisseurs au démarrage
  useEffect(() => {
    dispatch(fetchSupplierOrders())
  }, [dispatch])

  // 🔄 Rafraîchir toutes les 45 secondes uniquement si les données changent
  useEffect(() => {
    const interval = setInterval(() => {
      if (!_.isEqual(supplierOrders, prevOrdersRef.current)) {
        dispatch(fetchSupplierOrders())
        prevOrdersRef.current = supplierOrders
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [dispatch, supplierOrders])

  // 🔍 Filtrage des commandes expédiées
  const filteredOrders = supplierOrders?.filter(
    (order) =>
      order.statut?.toLowerCase() === "expédié" &&
      order._id?.toLowerCase().startsWith(searchTerm.toLowerCase())
  )

  return (
    <Box>
      <TextField
        label="Rechercher une commande fournisseur par ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <AwaitingSupplierTable data={filteredOrders} />
    </Box>
  )
}
