import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchStocks, updateStock } from "../../redux/slices/stockSlice"
import { io } from "socket.io-client"

// 🔥 Évite de recréer plusieurs fois la connexion
const socket = io("http://localhost:5000", { autoConnect: false })

const StockUpdater = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket.connected) {
      socket.connect() // Connecte le socket seulement s'il n'est pas déjà connecté
      console.log("✅ WebSocket connecté :", socket.id)
    }
    dispatch(fetchStocks()) // 🔄 Met à jour Redux

    socket.on("stocksUpdated", (updatedStocks) => {
      console.log("🟢 Mise à jour des stocks reçue :", updatedStocks)
      dispatch(
        updateStock({
          stockId: updatedStocks.stockId,
          product_id: updatedStocks.product_id,
          quantity: updatedStocks.quantity,
        })
      ) // 🔄 Met à jour Redux
      dispatch(fetchStocks()) // 🔄 Met à jour Redux
    })

    return () => {
      console.log("🔴 Déconnexion propre du WebSocket :", socket.id)
      socket.off("stocksUpdated") // 🔥 Supprime l'écouteur
    }
  }, [dispatch])

  return null
}

export default StockUpdater
