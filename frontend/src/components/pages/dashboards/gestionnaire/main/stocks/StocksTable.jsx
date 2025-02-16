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
} from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import axiosInstance from "../../../../../../axiosConfig"
import { useEffect } from "react"

const getEventStyle = (event) => {
  const styles = {
    entrée: { color: "green", fontWeight: "bold" },
    sortie: { color: "red", fontWeight: "bold" },
    création: { color: "blue", fontWeight: "bold" },
  }
  return styles[event.toLowerCase()] || { color: "black", fontWeight: "bold" }
}

function Row({ row, onReassort }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: row.quantity < 50 ? "#ffcccc" : "inherit",
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
        <TableCell>{row.product_id.reference}</TableCell>
        <TableCell>{row.product_id.category_id.name}</TableCell>
        <TableCell>{row.product_id.supplier_id.name}</TableCell>
        <TableCell
          style={row.quantity < 50 ? { color: "red", fontWeight: "bold" } : {}}
        >
          {row.quantity}
        </TableCell>
        <TableCell>{row.product_id.price} €</TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onReassort(row)}
          >
            Réassort
          </Button>
        </TableCell>
      </TableRow>

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
  width: 400,
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
  const [order, setOrder] = React.useState("asc")
  const [orderBy, setOrderBy] = React.useState("quantity")
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedStock, setSelectedStock] = React.useState(null)
  const [reassortQuantity, setReassortQuantity] = React.useState("")
  const [error, setError] = React.useState("")

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }
  useEffect(() => {
    console.log("🔄 Stocks mis à jour", stocks)
  }, [stocks])
  const handleOpenModal = (stock) => {
    setSelectedStock(stock)
    setReassortQuantity("")
    setError("")
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedStock(null)
    setModalOpen(false)
  }

  const handleConfirmReassort = async () => {
    const quantity = parseInt(reassortQuantity, 10)

    if (!reassortQuantity || isNaN(quantity) || quantity < 1) {
      setError("Veuillez entrer une quantité valide (≥ 1).")
      return
    }

    try {
      await axiosInstance.put(`/stocks/increment/${selectedStock._id}`, {
        quantity: quantity,
      })

      await axiosInstance.post(`/stock_logs`, {
        product_id: selectedStock.product_id._id,
        quantity: quantity,
        event: "entrée",
        stock_id: selectedStock._id,
      })
    } catch (error) {
      alert("Une erreur s'est produite : " + error.message)
    }

    handleCloseModal()
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Produit</TableCell>
            <TableCell>Référence</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell>Fournisseur</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "quantity"}
                direction={orderBy === "quantity" ? order : "asc"}
                onClick={() => handleSort("quantity")}
              >
                Quantité
              </TableSortLabel>
            </TableCell>
            <TableCell>Prix (€)</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
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
            onChange={(e) => {
              setReassortQuantity(e.target.value)
              setError("")
            }}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            variant="outlined"
            inputProps={{ min: 1 }}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleCloseModal} color="error">
              Annuler
            </Button>
            <Button
              onClick={handleConfirmReassort}
              variant="contained"
              disabled={Boolean(error)}
            >
              Confirmer
            </Button>
          </Box>
        </Box>
      </Modal>
    </TableContainer>
  )
}
