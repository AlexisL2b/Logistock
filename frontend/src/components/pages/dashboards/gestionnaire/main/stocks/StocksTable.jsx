import * as React from "react"
import PropTypes from "prop-types"
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TableSortLabel,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

// Fonction pour styliser les événements
const getEventStyle = (event) => {
  const styles = {
    entrée: { color: "green", fontWeight: "bold" },
    sortie: { color: "red", fontWeight: "bold" },
    création: { color: "blue", fontWeight: "bold" },
  }
  return styles[event.toLowerCase()] || { color: "black", fontWeight: "bold" }
}

function Row({ row }) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      {/* Ligne principale du tableau */}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: row.quantite_disponible < 50 ? "#ffcccc" : "inherit",
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.produit_id.nom}
        </TableCell>
        <TableCell>{row.produit_id.reference}</TableCell>
        <TableCell>{row.produit_id.categorie_id.nom}</TableCell>
        <TableCell>{row.produit_id.supplier_id.nom}</TableCell>
        <TableCell
          align="right"
          style={
            row.quantite_disponible < 50
              ? { color: "red", fontWeight: "bold" }
              : {}
          }
        >
          {row.quantite_disponible}
        </TableCell>
        <TableCell align="right">{row.produit_id.prix} €</TableCell>
      </TableRow>

      {/* Volet avec les logs */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Historique des Stocks
              </Typography>
              <Table size="small" aria-label="stock-logs">
                <TableHead>
                  <TableRow>
                    <TableCell>Événement</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Quantité</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.stockLogs.length > 0 ? (
                    row.stockLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell style={getEventStyle(log.evenement)}>
                          {log.evenement.charAt(0).toUpperCase() +
                            log.evenement.slice(1)}
                        </TableCell>
                        <TableCell>
                          {new Date(log.date_evenement).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{log.quantite}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Aucun historique disponible
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    produit_id: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      reference: PropTypes.string.isRequired,
      prix: PropTypes.number.isRequired,
      categorie_id: PropTypes.shape({
        nom: PropTypes.string.isRequired,
      }).isRequired,
      supplier_id: PropTypes.shape({
        nom: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    quantite_disponible: PropTypes.number.isRequired,
    stockLogs: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        evenement: PropTypes.string.isRequired,
        quantite: PropTypes.number.isRequired,
        date_evenement: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
}

export default function CollapsibleTable({ stocks }) {
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("quantite_disponible")

  // Fonction de tri
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  // Tri des stocks
  const sortedStocks = [...stocks].sort((a, b) => {
    if (orderBy === "quantite_disponible") {
      return order === "asc"
        ? a.quantite_disponible - b.quantite_disponible
        : b.quantite_disponible - a.quantite_disponible
    } else if (orderBy === "prix") {
      return order === "asc"
        ? a.produit_id.prix - b.produit_id.prix
        : b.produit_id.prix - a.produit_id.prix
    }
    return 0
  })

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Produit</TableCell>
            <TableCell>Référence</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell>Fournisseur</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "quantite_disponible"}
                direction={orderBy === "quantite_disponible" ? order : "asc"}
                onClick={() => handleSort("quantite_disponible")}
              >
                Quantité
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === "prix"}
                direction={orderBy === "prix" ? order : "asc"}
                onClick={() => handleSort("prix")}
              >
                Prix (€)
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStocks.map((stock) => (
            <Row key={stock._id} row={stock} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CollapsibleTable.propTypes = {
  stocks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      produit_id: PropTypes.shape({
        nom: PropTypes.string.isRequired,
        reference: PropTypes.string.isRequired,
        prix: PropTypes.number.isRequired,
        categorie_id: PropTypes.shape({
          nom: PropTypes.string.isRequired,
        }).isRequired,
        supplier_id: PropTypes.shape({
          nom: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      quantite_disponible: PropTypes.number.isRequired,
      stockLogs: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string.isRequired,
          evenement: PropTypes.string.isRequired,
          quantite: PropTypes.number.isRequired,
          date_evenement: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
}
