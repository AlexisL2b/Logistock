import express from "express"
import {
  handleStockEntry,
  handleOrderReception,
  handleStockRelease,
  handleOrderDispatch,
  decrementStockForOrder,
  checkStockAvailability,
  getAllStocks,
} from "../controllers/stockController.js"

const router = express.Router()

router.post("/entry", handleStockEntry) // Entrée en stock
router.post("/order", handleOrderReception) // Réception d'une commande
router.get("/all", getAllStocks) // Réception d'une commande
router.post("/release", handleStockRelease) // Sortie de stock
router.post("/dispatch", handleOrderDispatch) // Départ de commande
router.post("/check", checkStockAvailability)
// router.post("/decrement", async (req, res) => {
//   try {
//     const orderDetails = req.body.orderDetails // Les détails de la commande

router.post("/decrement", async (req, res) => {
  try {
    console.log("Requête reçue avec le corps :", req.body)

    const orderDetails = req.body // Assurez-vous que ce champ est correct
    if (!orderDetails || !Array.isArray(orderDetails)) {
      return res
        .status(400)
        .json({ message: "Les détails de la commande sont invalides." })
    }

    const result = await decrementStockForOrder(orderDetails)

    res.status(200).json({ message: result.message })
  } catch (error) {
    console.error("Erreur dans la route decrement :", error.message)
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du stock", error })
  }
})
//     const result = await decrementStockForOrder(orderDetails)

//     if (result.success) {
//       res.status(200).json({ message: result.message })
//     } else {
//       res.status(400).json({ message: result.message })
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Erreur lors de la mise à jour du stock", error })
//   }
// })
export default router
