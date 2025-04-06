import express from "express"
import orderShipmentController from "../controllers/orderShipmentController.js"
import validate from "../middlewares/validate.js"
import { orderShipmentSchema } from "../validations/orderShipmentValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Récupérer tous les départs de commandes
router.get("/", orderShipmentController.getAll)

// ✅ Récupérer un départ de commande par ID
router.get("/:id", orderShipmentController.getById)

// ✅ Récupérer un départ de commande par ID de commande
router.get("/by_order_id/:id", orderShipmentController.getByCommandeId)

// ✅ Ajouter un départ de commande
router.post(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  validate(orderShipmentSchema),

  orderShipmentController.create
)

// ✅ Mettre à jour un départ de commande
router.put(
  "/:id",
  protect,

  checkRole("Admin", "Gestionnaire"),
  validate(orderShipmentSchema),
  orderShipmentController.update
)

// ✅ Supprimer un départ de commande
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire"),

  orderShipmentController.remove
)

export default router
