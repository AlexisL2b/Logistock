import OrderDetails from "../models/orderDetailsModel.js"
import Order from "../models/orderModel.js"
import Stock from "../models/stockModel.js"

// Récupérer toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "acheteur_id",
      "nom prenom email"
    )
    res.json(orders)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error,
    })
  }
}

// Récupérer une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "acheteur_id",
      "nom prenom email"
    )
    if (!order) return res.status(404).json({ message: "Commande introuvable" })
    res.json(order)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la commande",
      error,
    })
  }
}

// Ajouter une nouvelle commande
export const addOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body)
    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la commande",
      error,
    })
  }
}
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params

    // Récupérer les commandes pour l'utilisateur donné
    const orders = await Order.find({ acheteur_id: userId }).sort({
      date_commande: -1,
    })

    res.status(200).json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error)
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes",
      error,
    })
  }
}
export const getAllOrdersWithDetails = async (req, res) => {
  try {
    // Étape 1 : Récupérer toutes les commandes
    const orders = await Order.find().sort({
      date_commande: -1,
    })

    // Étape 2 : Récupérer les détails des commandes pour chaque commande
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetails.find({
          commande_id: order._id,
        })

        // Étape 3 : Ajouter les informations de stock pour chaque produit
        const detailsWithStock = await Promise.all(
          details.map(async (detail) => {
            // Récupérer le stock associé au produit
            const stock = await Stock.findOne({ produit_id: detail.produit_id })

            return {
              ...detail._doc, // Inclut les données actuelles du détail
              stock: stock
                ? {
                    quantite_totale: stock.quantite_totale,
                    quantite_disponible: stock.quantite_disponible,
                    quantite_reservee: stock.quantite_reservee,
                    statut: stock.statut,
                  }
                : null, // Si aucun stock n'est trouvé
            }
          })
        )

        return {
          order_id: order._id,
          date_commande: order.date_commande,
          statut: order.statut,
          produitDetails: detailsWithStock, // Détails avec le stock inclus
        }
      })
    )

    // Étape 4 : Retourner le résultat formaté
    res.status(200).json(ordersWithDetails)
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes avec détails et stock :",
      error
    )
    res.status(500).json({
      message:
        "Erreur lors de la récupération des commandes avec détails et stock",
      error,
    })
  }
}

export const getOrdersWithDetails = async (req, res) => {
  try {
    const { userId } = req.params

    // Étape 1 : Récupérer les commandes pour l'utilisateur donné
    const orders = await Order.find({ acheteur_id: userId }).sort({
      date_commande: -1,
    })

    // Étape 2 : Récupérer les détails des commandes pour chaque commande
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetails.find({
          commande_id: order._id,
        })
        return {
          order_id: order._id,
          date_commande: order.date_commande,
          statut: order.statut,
          produitDetails: details,
        }
      })
    )

    // Étape 3 : Retourner le résultat formaté
    res.status(200).json(ordersWithDetails)
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes avec détails :",
      error
    )
    res.status(500).json({
      message: "Erreur lors de la récupération des commandes avec détails",
      error,
    })
  }
}

// Mettre à jour une commande par ID
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Renvoie l'objet mis à jour
        runValidators: true, // Valide les champs avant de les enregistrer
      }
    )
    if (!updatedOrder)
      return res.status(404).json({ message: "Commande introuvable" })
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la commande",
      error,
    })
  }
}

// Supprimer une commande par ID
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id)
    if (!deletedOrder)
      return res.status(404).json({ message: "Commande introuvable" })
    res.json({ message: "Commande supprimée avec succès" })
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la commande",
      error,
    })
  }
}
