import express from "express"
import orderController from "../controllers/orderController.js"
import validate from "../middlewares/validate.js"
import {
  orderSchemaPost,
  orderSchemaPut,
} from "../validations/orderValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Récupérer toutes les commandes (accessible à tous les rôles autorisés)
router.get(
  "/",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien"),
  orderController.getAll
)

// ✅ Récupérer une commande par ID
router.get(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien", "Acheteur"),
  orderController.getById
)

// ✅ Ajouter une nouvelle commande (avec détails et expédition)
router.post(
  "/",
  protect,
  checkRole("Acheteur"),
  validate(orderSchemaPost),
  orderController.create
)

// ✅ Modifier une commande
router.put(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Logisticien", "Acheteur"),
  validate(orderSchemaPut),
  orderController.update
)

// ✅ Supprimer une commande (uniquement pour Admin, Gestionnaire et Acheteur)
router.delete(
  "/:id",
  protect,
  checkRole("Admin", "Gestionnaire", "Acheteur"),
  orderController.remove
)

// ✅ Récupérer toutes les commandes d'un acheteur donné
router.get(
  "/user/:buyer_id",
  protect,
  checkRole("Admin", "Gestionnaire", "Acheteur"),
  orderController.getByBuyer
)

export default router
