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
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"

import _ from "lodash"
import axiosInstance from "../../../../../../axiosConfig"

function Row({ row, onStatusUpdate }) {
  const [open, setOpen] = useState(false)

  // Définition des couleurs pour les statuts
  const color = {
    "en cours": "orange",
    validée: "green",
    expédiée: "blue",
    annulée: "red",
    réceptionné: "purple", // Nouveau statut
  }

  const handleReception = async () => {
    if (!window.confirm("Confirmez-vous la réception de cette commande ?"))
      return

    try {
      // Envoyer la requête pour mettre à jour le statut en BDD
      const response = await axiosInstance.put(
        `http://localhost:5000/api/orders/${row.order_id}`,
        { statut: "réceptionné" }
      )

      if (response.status === 200) {
        onStatusUpdate(row.order_id, "réceptionné") // Mise à jour locale
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error)
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
        <TableCell
          sx={{
            color: color[row.statut] || "black",
            fontWeight: "700",
          }}
        >
          {_.capitalize(row.statut)}
        </TableCell>
      </TableRow>

      {/* Volet collapsible pour les détails + Bouton Réceptionné */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails des produits
              </Typography>
              <Table size="small" aria-label="details">
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.produitDetails.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>{product.quantite}</TableCell>
                      <TableCell>{product.prix_unitaire}</TableCell>
                      <TableCell>
                        {product.quantite * product.prix_unitaire}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Bouton Réceptionné DANS le volet collapsible */}
              <Box mt={2} textAlign="right">
                {row.statut !== "réceptionné" && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReception}
                    disabled={row.statut === "annulée"}
                  >
                    Réceptionné
                  </Button>
                )}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
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
        commande_id: PropTypes.string.isRequired,
        produit_id: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prix_unitaire: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
}

export default function CollapsingTable({ data }) {
  const [orders, setOrders] = useState(data)

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.order_id === orderId ? { ...order, statut: newStatus } : order
      )
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Identifiant commande</TableCell>
            <TableCell>Date de Commande</TableCell>
            <TableCell>Statut</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((row) => (
            <Row
              key={row.order_id}
              row={row}
              onStatusUpdate={updateOrderStatus}
            />
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
          commande_id: PropTypes.string.isRequired,
          produit_id: PropTypes.string.isRequired,
          quantite: PropTypes.number.isRequired,
          prix_unitaire: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}
