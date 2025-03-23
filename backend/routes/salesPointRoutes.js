import express from "express"
import salesPointController from "../controllers/salesPointController.js"
import validate from "../middlewares/validate.js"
import { salesPointSchema } from "../validations/salesPointValidation.js"
import { protect } from "../middlewares/authMiddleware.js"
import { checkRole } from "../middlewares/checkRole.js"

const router = express.Router()

// ✅ Récupérer les points de vente sans utilisateurs
router.get(
  "/without_users",
  // protect,
  // checkRole("admin", "Gestionnaire"),
  salesPointController.getWithoutUsers
)

// ✅ Récupérer tous les points de vente
router.get("/", salesPointController.getAll)

// ✅ Récupérer un point de vente par ID
router.get("/:id", salesPointController.getById)

// ✅ Ajouter un nouveau point de vente
router.post(
  "/",
  validate(salesPointSchema),
  protect,
  checkRole("admin", "Gestionnaire"),
  salesPointController.create
)

// ✅ Mettre à jour un point de vente
router.put(
  "/:id",
  validate(salesPointSchema),
  protect,
  checkRole("admin", "Gestionnaire"),
  salesPointController.update
)

// ✅ Supprimer un point de vente
router.delete(
  "/:id",
  protect,
  checkRole("admin", "Gestionnaire"),
  salesPointController.remove
)

export default router
