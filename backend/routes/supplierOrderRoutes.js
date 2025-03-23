import express from "express"
import supplierOrderController from "../controllers/supplierOrderController.js"

const router = express.Router()

router.post("/", supplierOrderController.create)
router.get("/", supplierOrderController.getAll)
router.get("/:id", supplierOrderController.getById)
router.put("/:id", supplierOrderController.update)
router.delete("/:id", supplierOrderController.delete)

export default router
