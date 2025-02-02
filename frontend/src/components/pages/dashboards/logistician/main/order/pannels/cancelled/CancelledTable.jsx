import React, { useEffect, useState } from "react"
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
import { useSelector, useDispatch } from "react-redux"
import {
  fetchStocks,
  updateStock,
} from "../../../../../../../../redux/slices/stockSlice"
import { io } from "socket.io-client"
import { fetchOrdersWithDetails } from "../../../../../../../../redux/slices/orderSlice"
import _ from "lodash"

function Row({ row }) {
  const [open, setOpen] = useState(false)
  const color = {
    "en cours": "orange",
    validée: "green",
    expédiée: "blue",
    annulée: "red",
    réceptionné: "purple", // Nouveau statut
  }
  const dispatch = useDispatch()

  // Récupérer les stocks depuis Redux
  const stocks = useSelector((state) => state.stocks.stocks)

  // Écouter les mises à jour en temps réel via Socket.IO
  useEffect(() => {
    const socket = io("http://localhost:5000") // Connexion au backend

    // Réception des mises à jour des stocks
    socket.on("stocksUpdated", (updatedStocks) => {
      updatedStocks.forEach((stock) => {
        dispatch(
          updateStock({
            stockId: stock.stockId,
            stockUpdates: { quantite_totale: stock.quantite_totale },
          })
        )
      })
      dispatch(fetchStocks())
      dispatch(fetchOrdersWithDetails())
    })
    return () => socket.disconnect() // Déconnexion propre
  }, [dispatch])

  return (
    <>
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
                    <TableCell>Stock Disponible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.produitDetails.map((product) => {
                    const stockInfo = stocks.find(
                      (stock) => stock.produit_id === product.produit_id
                    )
                    return (
                      <TableRow key={product._id}>
                        <TableCell>{product.produit_id}</TableCell>
                        <TableCell>{product.quantite}</TableCell>
                        <TableCell>{product.prix_unitaire}</TableCell>
                        <TableCell>
                          {stockInfo ? stockInfo.quantite_totale : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
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
        produit_id: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        prix_unitaire: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default function CancelledTable({ data }) {
  const dispatch = useDispatch()
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })

  // Charger les stocks au démarrage
  useEffect(() => {
    dispatch(fetchStocks())
  }, [dispatch])

  // Fonction de tri
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  // Appliquer le tri sur les données
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0 // Si pas de tri sélectionné, ne rien changer
    const order = sortConfig.direction === "asc" ? 1 : -1
    return a[sortConfig.key] > b[sortConfig.key] ? order : -order
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell
              onClick={() => handleSort("order_id")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Order ID{" "}
              {sortConfig.key === "order_id" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell
              onClick={() => handleSort("date_commande")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Date de Commande{" "}
              {sortConfig.key === "date_commande" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Statut{" "}
              {sortConfig.key === "statut" && (
                <IconButton size="small">
                  {sortConfig.direction === "asc" ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <Row key={row.order_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CancelledTable.propTypes = {
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
        })
      ).isRequired,
    })
  ).isRequired,
}
