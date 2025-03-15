import { useState, useMemo, memo } from "react"
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
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material"
import { useDispatch } from "react-redux" // 🔥 Import Redux
import {
  addUser,
  deleteUserById,
} from "../../../../../../redux/slices/userSlice" // 🔥 Import du thunk Redux
import ConfirmationDialog from "../../../../../reusable-ui/dialogs/ConfirmationDialog"
import SignUpForm from "../../../../../reusable-ui/usersforms/SignUpForm"
import EditIcon from "@mui/icons-material/Edit"
import EditForm from "../../../../../reusable-ui/usersforms/EditForm"

// Fonction de comparaison pour le tri
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Composant Table réutilisable
function BasicTable({
  admin,
  data,
  coll,
  onDataChange,
  headerMapping,
  trigger,
}) {
  const dispatch = useDispatch() // 🔥 Initialisation de Redux Dispatch
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState(Object.keys(data[0] || [])[0] || "")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [message, setMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [severity, setSeverity] = useState("")
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  })

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true)
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false)
  const handleOpenAddDialog = () => setOpenAddDialog(true)
  const handleCloseAddDialog = () => setOpenAddDialog(false)
  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false)
  }

  const handleConfirm = () => {
    handleDelete()
  }
  const handleUserUpdated = () => {
    setSnackbar({
      open: true,
      message: "Utilisateur mis à jour avec succès !",
      severity: "success",
    })
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000)
    if (onDataChange) {
      onDataChange()
    }
    setOpenUpdateDialog(false)
  }

  const handleOpenEdit = (user) => {
    setSelectedUser(user)
    setOpenUpdateDialog(true)
  }

  // Création des colonnes dynamiques
  const headCells = data.length
    ? Object.keys(data[0]).map((key) => ({
        id: key,
        numeric: typeof data[0][key] === "number",
        disablePadding: false,
        label: headerMapping[key] || key.charAt(0).toUpperCase() + key.slice(1),
      }))
    : []

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(data.map((n) => n._id))
    } else {
      setSelected([])
    }
  }

  const handleRowSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // ✅ Suppression via Redux

  // ✅ Ajout d'un utilisateur via Redux
  const handleAddUser = async (newUserData) => {
    try {
      setSnackbar({
        open: true,
        message: "Utilisateur ajouté avec succès !",
        severity: "success",
      })

      // handleCloseAddDialog()

      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateuzaeeazazer :", error)

      setSnackbar({
        open: true,
        message: error.message || "Erreur lors de l'ajout.",
        severity: "error",
      })
    }
  }

  // ✅ Suppression via Redux
  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        alert("Aucun élément sélectionné pour suppression !")
        return
      }

      for (const id of selected) {
        dispatch(deleteUserById(id)) // 🔥 Suppression via Redux
      }

      setMessage("Suppression réussie !")
      setSeverity("success")
      setShowAlert(true)
      setSelected([])
      setOpenDeleteDialog(false)
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      setMessage(error.message || "Erreur lors de la suppression.")
      setSeverity("error")
      setShowAlert(true)
    }
  }

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0

  const visibleRows = useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
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
        <Alert
          onClose={() => setShowAlert(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
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
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={(event) => handleRequestSort(event, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow
                  hover
                  key={row._id}
                  selected={selected.includes(row._id)}
                  onClick={() => handleRowSelect(row._id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={selected.includes(row._id)} />
                  </TableCell>
                  {Object.values(row).map((value, index) => (
                    <TableCell key={index}>
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value) // Option 1 : Convertir en texte
                        : value}
                    </TableCell>
                  ))}
                  <TableCell padding="checkbox">
                    <IconButton onClick={() => handleOpenEdit(row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDeleteDialog}
        >
          Supprimer
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenAddDialog}
        >
          Ajouter
        </Button>
      </Box>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <SignUpForm
            admin={admin}
            onClose={handleCloseAddDialog}
            onUserAdded={handleAddUser}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Annuler</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
      >
        <DialogTitle>Modifier un utilisateur</DialogTitle>
        <DialogContent>
          {/* {selectedUser && ( */}
          <EditForm
            admin={true}
            row={selectedUser}
            // onClose={handleClose}
            onUserUpdated={handleUserUpdated}
          />
          {/* )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
      />
    </Box>
  )
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  coll: PropTypes.string.isRequired,
  onDataChange: PropTypes.func,
  headerMapping: PropTypes.object,
}

export default memo(BasicTable)
