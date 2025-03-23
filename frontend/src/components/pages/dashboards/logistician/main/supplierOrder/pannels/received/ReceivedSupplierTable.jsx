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
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material"

function Row({ row }) {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row._id}</TableCell>
        <TableCell>{new Date(row.orderedAt).toLocaleString()}</TableCell>
        <TableCell sx={{ fontWeight: "bold", color: "green" }}>
          {row.statut}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={2}>
              <Typography variant="h6" gutterBottom>
                Détails de la commande
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Produit</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Référence</TableCell>
                    <TableCell>Catégorie</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map((product, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {product.product_id?._id || product.product_id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.reference}</TableCell>
                      <TableCell>{product.category}</TableCell>
                    </TableRow>
                  ))}
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
}

export default function ReceivedSupplierTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" })

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0
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
              onClick={() => handleSort("_id")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              ID
            </TableCell>
            <TableCell
              onClick={() => handleSort("orderedAt")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Date
            </TableCell>
            <TableCell
              onClick={() => handleSort("statut")}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              Statut
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row) => (
            <Row key={row._id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

ReceivedSupplierTable.propTypes = {
  data: PropTypes.array.isRequired,
}
