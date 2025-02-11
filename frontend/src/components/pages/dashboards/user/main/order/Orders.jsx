import React, { useEffect, useState } from "react"
import { loadUserFromLocalStorage } from "../../../../../../utils/localStorage"
import CollapsingTable from "./CollapsingTable"
import {
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"

export default function Orders() {
  const user = loadUserFromLocalStorage()
  const userId = user?._id
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)

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

  // 📌 Ouvrir la boîte de dialogue de confirmation
  const handleOpenDialog = (order) => {
    setSelectedOrder(order)
    setOpenDialog(true)
  }

  // 📌 Fermer la boîte de dialogue
  const handleCloseDialog = () => {
    setSelectedOrder(null)
    setOpenDialog(false)
  }

  // ✅ Confirmer la réception de la commande
  const handleConfirmReception = async () => {
    if (!selectedOrder) return

    try {
      await axiosInstance.put(
        `http://localhost:5000/api/orders/${selectedOrder.order_id}/receive`
      )

      // Mettre à jour le statut de la commande
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrder.order_id
            ? { ...order, status: "Reçu" }
            : order
        )
      )

      setOpenDialog(false)
    } catch (error) {
      console.error("Erreur lors de la confirmation de réception :", error)
    }
  }

  if (loading) return <div>Chargement des commandes...</div>

  return (
    <Box sx={{ maxWidth: "1200px", margin: "auto", p: 3 }}>
      {/* 🔍 Champ de recherche */}
      <TextField
        label="Rechercher une commande par ID"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* 📋 Table filtrée */}
      <CollapsingTable data={filteredOrders} onConfirm={handleOpenDialog} />

      {/* 📦 Dialog de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirmez-vous la réception de cette commande ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmReception}
            color="primary"
            variant="contained"
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
