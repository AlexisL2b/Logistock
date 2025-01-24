import React, { useEffect, useState } from "react"
import { loadUserFromLocalStorage } from "../../../../../../utils/localStorage"
import { useDispatch } from "react-redux"
import axios from "axios"
import CollapsingTable from "./CollapsingTable"
import { Box } from "@mui/material"

export default function Orders() {
  const user = loadUserFromLocalStorage()
  const userId = user._id
  const dispatch = useDispatch()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrdersWithDetails = async () => {
      try {
        if (!userId) return

        // Appeler la nouvelle route backend
        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}/orders-details`
        )
        setOrders(response.data) // Mettre à jour les commandes
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err)
        // setError("Impossible de charger les commandes.")
      } finally {
        setLoading(false) // Arrêter le chargement
      }
    }

    fetchOrdersWithDetails()
  }, [userId])

  console.log(orders)
  if (loading) return <div>Chargement des commandes...</div> // Affichage pendant le chargement
  // if (error) return <div>{error}</div> // Affichage en cas d'erreur

  return (
    <Box>
      <CollapsingTable data={orders} />
    </Box>
  )
}
