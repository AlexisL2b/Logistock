import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Typography,
  Paper,
  Button,
  Modal,
  Tooltip,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"
import axios from "axios"

function Row({ row }) {
  const [open, setOpen] = useState(false) // Contrôle du volet collapsible
  const [modalOpen, setModalOpen] = useState(false) // Contrôle de la modale
  const [isLoading, setIsLoading] = useState(false) // État de chargement
  const [errorMessage, setErrorMessage] = useState("") // Message d'erreur

  // Style pour la modale
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  }

  // Vérifier si une commande dépasse le stock total
  const hasStockIssue = row.produitDetails.some(
    (product) =>
      product.quantite > (product.stock ? product.stock.quantite_totale : 0)
  )

  // Gérer la validation de la commande
  const handleValidate = async () => {
    try {
      setIsLoading(true)
      setErrorMessage("")

      // Construire les détails de la commande
      const orderDetails = row.produitDetails.map((product) => ({
        produit_id: product.produit_id,
        quantite: product.quantite,
      }))

      // Vérifier les quantités disponibles avant décrémentation
      const checkStockResponse = await axios.post("/api/stocks/check", {
        orderDetails,
      })

      const insufficientStock = checkStockResponse.data.insufficientStock

      if (insufficientStock && insufficientStock.length > 0) {
        // Construire un message pour informer l'utilisateur des produits avec un stock insuffisant
        const errorMessage = insufficientStock
          .map(
            (product) =>
              `Produit ID: ${product.produit_id} - Stock disponible: ${product.stockDisponible}, Quantité demandée: ${product.quantite}\n`
          )
          .join("") // Pas besoin d'ajouter un "\n" ici, car chaque ligne en a déjà un

        setErrorMessage(
          `Stock insuffisant pour les produits suivants :\n\n${errorMessage}`
        ) // Ajoute un saut de ligne après le titre pour plus de clarté
        return
      }
      // Si tout est bon, décrémenter les stocks
      const response = await axios.post("/api/stocks/decrement", {
        orderDetails,
      })

      // Succès : Afficher un message ou gérer l'état global
      console.log(response.data.message)

      setModalOpen(false) // Fermer la modale
    } catch (error) {
      // Gérer les erreurs de l'API
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la validation"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Ligne principale */}
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.order_id}</TableCell>
        <TableCell>{new Date(row.date_commande).toLocaleString()}</TableCell>
        <TableCell>{row.statut}</TableCell>
      </TableRow>

      {/* Volet collapsible pour les détails */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails des produits
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Produit</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.produitDetails.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.produit_id}</TableCell>
                      <TableCell>{product.quantite}</TableCell>
                      <TableCell>{product.prix_unitaire}</TableCell>
                      <TableCell>
                        {product.quantite * product.prix_unitaire}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Bouton pour ouvrir la modale */}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setModalOpen(true)}
                sx={{ mt: 2 }}
              >
                Voir Récapitulatif
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Modale */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Récapitulatif de la commande
          </Typography>

          {/* Tableau récapitulatif */}
          <Table size="small" aria-label="recapitulatif">
            <TableHead>
              <TableRow>
                <TableCell>ID Produit</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Prix Unitaire</TableCell>
                <TableCell>Stock Disponible</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {row.produitDetails.map((product) => {
                const isStockInsufficient =
                  product.quantite >
                  (product.stock ? product.stock.quantite_totale : 0)

                return (
                  <Tooltip
                    title={
                      isStockInsufficient
                        ? "Stock insuffisant pour ce produit"
                        : ""
                    }
                    arrow
                    placement="top"
                    key={product._id}
                  >
                    <TableRow
                      sx={
                        isStockInsufficient
                          ? { backgroundColor: "rgba(255, 0, 0, 0.1)" } // Couleur rougeâtre
                          : { backgroundColor: "rgba(0, 128, 0, 0.1)" } // Couleur verdâtre
                      }
                    >
                      <TableCell>{product.produit_id}</TableCell>
                      <TableCell>{product.quantite}</TableCell>
                      <TableCell>{product.prix_unitaire}</TableCell>
                      <TableCell>
                        {product.stock ? product.stock.quantite_totale : "N/A"}
                      </TableCell>
                    </TableRow>
                  </Tooltip>
                )
              })}
            </TableBody>
          </Table>

          {/* Afficher les erreurs */}
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {/* Boutons de validation et d'annulation */}
          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              color="success"
              onClick={handleValidate}
              disabled={hasStockIssue || isLoading}
            >
              {isLoading ? "Validation..." : "Valider la commande"}
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setModalOpen(false)
              }}
            >
              Annuler la commande
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    order_id: PropTypes.string.isRequired,
    date_commande: PropTypes.string.isRequired,
    statut: PropTypes.string.isRequired,
    produitDetails: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        produit_id: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prix_unitaire: PropTypes.number.isRequired,
        stock: PropTypes.shape({
          quantite_totale: PropTypes.number,
        }),
      })
    ).isRequired,
  }).isRequired,
}

export default function CollapsingTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Order ID</TableCell>
            <TableCell>Date de Commande</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <Row key={row.order_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CollapsingTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      order_id: PropTypes.string.isRequired,
      date_commande: PropTypes.string.isRequired,
      statut: PropTypes.string.isRequired,
      produitDetails: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          produit_id: PropTypes.string.isRequired,
          quantite: PropTypes.number.isRequired,
          prix_unitaire: PropTypes.number.isRequired,
          stock: PropTypes.shape({
            quantite_totale: PropTypes.number,
          }),
        })
      ).isRequired,
    })
  ).isRequired,
}
