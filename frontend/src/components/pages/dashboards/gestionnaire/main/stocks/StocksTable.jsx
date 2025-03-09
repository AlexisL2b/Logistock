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
  Button,
  Modal,
  TextField,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import axiosInstance from "../../../../../../axiosConfig"
import { useEffect, useState } from "react"

const getEventStyle = (event) => {
  const styles = {
    entrée: { color: "green", fontWeight: "bold" },
    sortie: { color: "red", fontWeight: "bold" },
    création: { color: "blue", fontWeight: "bold" },
  }
  return styles[event.toLowerCase()] || { color: "black", fontWeight: "bold" }
}

function Row({ row, onReassort }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: row.quantity < 50 ? "#ffcccc" : "inherit",
          flexDirection: isSmallScreen ? "column" : "row",
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
        <TableCell>{row.product_id.name}</TableCell>
        {!isSmallScreen && <TableCell>{row.product_id.reference}</TableCell>}
        {!isSmallScreen && (
          <TableCell>{row.product_id.category_id.name}</TableCell>
        )}
        {!isSmallScreen && (
          <TableCell>{row.product_id.supplier_id.name}</TableCell>
        )}
        <TableCell
          style={row.quantity < 50 ? { color: "red", fontWeight: "bold" } : {}}
        >
          {row.quantity}
        </TableCell>
        {!isSmallScreen && <TableCell>{row.product_id.price} €</TableCell>}
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth={isSmallScreen}
            onClick={() => onReassort(row)}
          >
            Réassort
          </Button>
        </TableCell>
      </TableRow>

      {open && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Historique des Stocks
                </Typography>
                <Table size="small" aria-label="stock-logs">
                  <TableHead>
                    <TableRow>
                      <TableCell>Événement</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Quantité</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.stockLogs.length > 0 ? (
                      row.stockLogs.map((log) => (
                        <TableRow key={log._id}>
                          <TableCell style={getEventStyle(log.event)}>
                            {log.event.charAt(0).toUpperCase() +
                              log.event.slice(1)}
                          </TableCell>
                          <TableCell>
                            {new Date(log.date_event).toLocaleString()}
                          </TableCell>
                          <TableCell>{log.quantity}</TableCell>
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
      )}
    </>
  )
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  onReassort: PropTypes.func.isRequired,
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  gap: 2,
}

export default function CollapsibleTable({ stocks }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [reassortQuantity, setReassortQuantity] = useState("")
  const [stocksData, setStocksData] = useState(stocks)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const handleOpenModal = (stock) => {
    setSelectedStock(stock)
    setReassortQuantity("")
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedStock(null)
    setModalOpen(false)
  }

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Produit</TableCell>
            {!isSmallScreen && <TableCell>Référence</TableCell>}
            {!isSmallScreen && <TableCell>Catégorie</TableCell>}
            {!isSmallScreen && <TableCell>Fournisseur</TableCell>}
            <TableCell>Quantité</TableCell>
            {!isSmallScreen && <TableCell>Prix (€)</TableCell>}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocksData.map((stock) => (
            <Row key={stock._id} row={stock} onReassort={handleOpenModal} />
          ))}
        </TableBody>
      </Table>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Réassort du produit</Typography>
          <TextField
            label="Quantité de réassort"
            type="number"
            value={reassortQuantity}
            onChange={(e) => setReassortQuantity(e.target.value)}
            fullWidth
          />
          <Button onClick={handleCloseModal} variant="outlined">
            Annuler
          </Button>
          <Button onClick={handleCloseModal} variant="contained">
            Confirmer
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Réassort effectué avec succès !
        </Alert>
      </Snackbar>
    </TableContainer>
  )
}
