import TransporterDAO from "../dao/transporterDAO.js"

class TransporterService {
  async getAllTransporters() {
    return await TransporterDAO.findAll()
  }

  async getTransporterById(id) {
    const transporter = await TransporterDAO.findById(id)
    if (!transporter) {
      throw new Error("Transporteur introuvable")
    }
    return transporter
  }

  async addTransporter(transporterData) {
    if (!transporterData.name) {
      throw new Error("Le champ 'nom' est requis")
    }
    return await TransporterDAO.create(transporterData)
  }

  async updateTransporter(id, transporterData) {
    const updatedTransporter = await TransporterDAO.update(id, transporterData)
    if (!updatedTransporter) {
      throw new Error("Transporteur introuvable")
    }
    return updatedTransporter
  }

  async deleteTransporter(id) {
    const deletedTransporter = await TransporterDAO.delete(id)
    if (!deletedTransporter) {
      throw new Error("Transporteur introuvable")
    }
    return { message: "Transporteur supprimé avec succès" }
  }
}

export default new TransporterService()
