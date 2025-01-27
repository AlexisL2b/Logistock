import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOrdersWithDetails } from "../../../../../../../redux/slices/orderSlice"
import { Box } from "@mui/material"
import CollapsingTableLogistician from "./CollapsingTableLogistician"
import { fetchStocks } from "../../../../../../../redux/slices/stockSlice"

export default function Awaiting() {
  const dispatch = useDispatch()
  const { orders, status, error } = useSelector((state) => state.orders)
  const { stocks } = useSelector((state) => state.stocks)
  console.log(stocks)
  // Charger les commandes uniquement au montage si nécessaire
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrdersWithDetails())
      dispatch(fetchStocks())
    }
  }, [dispatch, status])

  // Filtrer les commandes "en cours"
  const awaitingOrders = orders.filter((order) => order.statut === "en cours")

  if (status === "loading") return <div>Chargement des commandes...</div>
  if (status === "failed") return <div>Erreur : {error}</div>

  return (
    <Box>
      <CollapsingTableLogistician data={awaitingOrders} />
    </Box>
  )
}
