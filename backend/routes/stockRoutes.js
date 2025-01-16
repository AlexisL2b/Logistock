import express from "express"
import {
  handleStockEntry,
  handleOrderReception,
  handleStockRelease,
  handleOrderDispatch,
} from "../controllers/stockController.js"

const router = express.Router()

router.post("/entry", handleStockEntry) // Entrée en stock
router.post("/order", handleOrderReception) // Réception d'une commande
router.post("/release", handleStockRelease) // Sortie de stock
router.post("/dispatch", handleOrderDispatch) // Départ de commande

export default router
