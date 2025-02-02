import React, { useEffect, useState } from "react"
import { loadUserFromLocalStorage } from "../../../../../../utils/localStorage"

import CollapsingTable from "./CollapsingTable"
import { Box, TextField } from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"

export default function Orders() {
  const user = loadUserFromLocalStorage()
  const userId = user?._id
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      try {
        if (!userId) return

        // Récupérer les commandes depuis le backend
        const response = await axiosInstance.get(
          `http://localhost:5000/api/orders/user/${userId}/orders-details`
        )
        setOrders(response.data) // Stocker les commandes
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err)
      } finally {
        setLoading(false) // Désactiver l'état de chargement
      }
    }

    fetchOrdersWithDetails()
  }, [userId])

  // 🔍 Filtrer les commandes en fonction de la recherche
  const filteredOrders = orders.filter((order) =>
    order.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Chargement des commandes...</div>

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

      {/* Table filtrée */}
      <CollapsingTable data={filteredOrders} />
    </Box>
  )
}
