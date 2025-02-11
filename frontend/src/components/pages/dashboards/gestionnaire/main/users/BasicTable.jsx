import { useState, useMemo } from "react"
import PropTypes from "prop-types"
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Checkbox,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import SignUpForm from "../../../../signupPage/SignUpForm"

export default function BasicTable({
  data,
  coll,
  onDataChange,
  headerMapping,
  admin,
}) {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState(Object.keys(data[0] || [])[0] || "")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [message, setMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [severity, setSeverity] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true)
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false)

  const handleOpenDialog = () => setOpenDialog(true)
  const handleCloseDialog = () => setOpenDialog(false)

  const onClose = () => {
    setOpenDialog(false)
    setMessage("Inscription réussie")
    setSeverity("success")
    setShowAlert(true)
  }

  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        alert("Aucun élément sélectionné pour suppression !")
        return
      }

      for (const id of selected) {
        await axiosInstance.delete(`http://localhost:5000/api/${coll}/${id}`)
      }

      setMessage("Suppression réussie")
      setSeverity("success")
      setShowAlert(true)
      setSelected([])
      handleCloseConfirmDialog()

      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erreur lors de la suppression."
      )
      setSeverity("error")
      setShowAlert(true)
    }
  }

  const visibleRows = useMemo(
    () =>
      [...data]
        .sort((a, b) =>
          order === "desc"
            ? b[orderBy] < a[orderBy]
              ? -1
              : 1
            : a[orderBy] < b[orderBy]
            ? -1
            : 1
        )
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, order, orderBy, page, rowsPerPage]
  )

  return (
    <Box sx={{ width: "100%" }}>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={(event) =>
                      setSelected(
                        event.target.checked ? data.map((n) => n._id) : []
                      )
                    }
                    inputProps={{ "aria-label": "select all rows" }}
                  />
                </TableCell>
                {Object.keys(data[0] || {})
                  .filter((key) => key !== "_id")
                  .map((key) => (
                    <TableCell key={key}>
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : "asc"}
                        onClick={() => setOrderBy(key)}
                      >
                        {headerMapping[key] ||
                          key.charAt(0).toUpperCase() + key.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = selected.includes(row._id)

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    key={row._id}
                    selected={isItemSelected}
                    onClick={() =>
                      setSelected((prev) =>
                        prev.includes(row._id)
                          ? prev.filter((id) => id !== row._id)
                          : [...prev, row._id]
                      )
                    }
                  >
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" checked={isItemSelected} />
                    </TableCell>
                    {Object.keys(row)
                      .filter((key) => key !== "_id")
                      .map((key) => (
                        <TableCell key={key}>{row[key]}</TableCell>
                      ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </Paper>

      {/* Boutons alignés en bas à droite */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenConfirmDialog}
          sx={{ minWidth: "120px" }}
        >
          Supprimer
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleOpenDialog}
          sx={{ minWidth: "120px" }}
        >
          Ajouter
        </Button>
      </Box>

      {/* Boîte de dialogue pour ajouter un utilisateur */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <SignUpForm
            onClose={onClose}
            admin={admin}
            onUserAdded={onDataChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>

      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Voulez-vous vraiment supprimer ces éléments ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Annuler</Button>
          <Button color="error" onClick={handleDelete}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
