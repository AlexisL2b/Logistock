import {
  test, // ✅ Nouvelle route pour valider un paiement
} from "../controllers/testNginxController.js"
import express from "express"

const router = express.Router()
router.get("/", test)
export default router
