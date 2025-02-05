import express from "express"
import {
  decrementStockForOrder,
  checkStockAvailability,
  getAllStocks,
  getStockById,
  addStock,
  updateStock,
  updateStockByProductId,
  deleteStock,
  incrementStock,
} from "../controllers/stockController.js"

const router = express.Router()

// 🔹 Décrémenter le stock pour une commande
// router.post("/decrement", async (req, res) => {
//   try {
//     console.log("🔹 Headers reçus :", req.headers)
//     console.log("🔹 Body brut reçu :", req.body)

//     if (!req.body || Object.keys(req.body).length === 0) {
//       console.error("❌ ERREUR : req.body est undefined ou vide !")
//       return res.status(400).json({
//         message: "Le corps de la requête est vide !",
//         receivedHeaders: req.headers,
//         receivedBody: req.body,
//       })
//     }

//     const { orderDetails } = req.body

//     if (!Array.isArray(orderDetails)) {
//       console.error("❌ ERREUR : orderDetails n'est pas un tableau !")
//       return res.status(400).json({
//         message: "Les détails de la commande doivent être un tableau.",
//         body: req.body,
//       })
//     }

//     console.log("✅ orderDetails bien reçu :", orderDetails)

//     const io = req.app.get("io")

//     console.log("📢 Appel à decrementStockForOrder...")
//     const result = await decrementStockForOrder(orderDetails, io)
//     console.log("✅ Résultat reçu de decrementStockForOrder :", result)

//     res.status(200).json({
//       message: result.message,
//       updatedStocks: result.updatedStocks,
//     })
//   } catch (error) {
//     console.error("❌ Erreur dans la route decrement :", error.message)
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour du stock depuis les routes",
//       error: error.message,
//     })
//   }
// })
router.post("/decrement", decrementStockForOrder)
router.put("/increment", incrementStock)
// ✅ Route pour décrémenter le stock avec Socket.IO
// router.post("/decrement", async (req, res, next) => {
//   try {
//     // 🔹 Injecter `io` dans `req.app`
//     req.io = req.app.get("io")
//     console.log("✅ io injecté dans req.app", req.io)

//     // 📢 Appeler le contrôleur
//     await decrementStockForOrder(req, res)
//   } catch (error) {
//     console.error("❌ Erreur dans la route decrement :", error.message)
//     res.status(500).json({
//       message: "Erreur lors de la mise à jour du stock depuis les routes",
//       error: error.message,
//     })
//   }
// })
// 🔹 Vérifier la disponibilité des stocks pour une commande
router.post("/check", checkStockAvailability)

// 🔹 Gestion des stocks
router.get("/all", getAllStocks)
// Récupérer tous les stocks
router.get("/:id", getStockById) // Récupérer un stock par ID
router.post("/", addStock) // Ajouter un stock
router.put("/:id", updateStock) // Mettre à jour un stock par ID
router.put("/update-by-product/:produit_id", updateStockByProductId) // Mettre à jour un stock par ID produit
router.delete("/:id", deleteStock) // Supprimer un stock par ID

// // 🔹 Gestion des entrées et sorties de stock
// router.post("/entry", handleStockEntry) // Entrée en stock
// router.post("/order", handleOrderReception) // Réception d'une commande
// router.post("/release", handleStockRelease) // Sortie de stock
// router.post("/dispatch", handleOrderDispatch) // Départ de commande

export default router
