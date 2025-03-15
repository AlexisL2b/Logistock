import salesPointDAO from "../dao/salesPointDAO.js"
import userDAO from "../dao/userDAO.js"
import userService from "./userService.js"

class SalesPointService {
  // 🔹 Récupérer tous les points de vente
  async getAllSalesPoints() {
    try {
      return await salesPointDAO.findAll()
    } catch (error) {
      throw new Error(
        "Erreur lors de la récupération des points de vente : " + error.message
      )
    }
  }

  // 🔹 Récupérer un point de vente par ID
  async getSalesPointById(id) {
    const salesPoint = await salesPointDAO.findById(id)
    if (!salesPoint) {
      throw new Error("Point de vente introuvable")
    }
    return salesPoint
  }

  // 🔹 Ajouter un nouveau point de vente
  async addSalesPoint(data) {
    if (!data.name || !data.address) {
      throw new Error("Les champs 'nom' et 'adresse' sont obligatoires")
    }

    return await salesPointDAO.create(data)
  }

  // 🔹 Mettre à jour un point de vente
  async updateSalesPoint(id, data) {
    const existingSalesPoint = await salesPointDAO.findById(id)
    if (!existingSalesPoint) {
      throw new Error("Point de vente introuvable")
    }

    return await salesPointDAO.update(id, data)
  }

  // 🔹 Supprimer un point de vente
  async deleteSalesPoint(id) {
    const users = await userDAO.findBySalesPointId(id)
    const existingSalesPoint = await salesPointDAO.findById(id)

    if (!existingSalesPoint) {
      throw new Error("Point de vente introuvable")
    }
    if (users.length > 0) {
      const noms = users.map((p) => `${p.firstname} ${p.lastname}`).join(", ")
      throw new Error(
        `Impossible de supprimer le point de vente. Il est associée aux utilisateurs suivants : ${noms}`
      )
    }
    const deletedSalesPoint = await salesPointDAO.delete(id)
    // if (!deletedSalesPoint) {
    //   throw new Error("Catégorie introuvable")
    // }
    return deletedSalesPoint
  }
}

export default new SalesPointService()
