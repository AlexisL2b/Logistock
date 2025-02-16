import OrderShipment from "../models/orderShipmentModel.js"

class OrderShipmentDAO {
  async findAll() {
    return await OrderShipment.find()
      .populate("commande_id", "statut date_order")
      .populate("transporteur_id", "nom telephone")
  }

  async findById(id) {
    return await OrderShipment.findById(id)
      .populate("commande_id", "statut date_order")
      .populate("transporteur_id", "nom telephone")
  }

  async findByCommandeId(commandeId) {
    return await OrderShipment.find({ commande_id: commandeId })
  }

  async create(orderShipmentData) {
    const newOrderShipment = new OrderShipment(orderShipmentData)
    return await newOrderShipment.save()
  }

  async update(id, orderShipmentData) {
    return await OrderShipment.findByIdAndUpdate(id, orderShipmentData, {
      new: true,
      runValidators: true,
    })
  }

  async delete(id) {
    return await OrderShipment.findByIdAndDelete(id)
  }
}

export default new OrderShipmentDAO()
