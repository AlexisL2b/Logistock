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
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material"
import axiosInstance from "../../../../../../axiosConfig"
import SignUpForm from "../../../../signupPage/SignUpForm"

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

// Composant d'en-tête de la table
function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  headCells,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all rows" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
}

export default function BasicTable({
  admin,
  data,
  coll,
  onDataChange,
  headerMapping,
}) {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState(Object.keys(data[0] || [])[0] || "")
  const [selected, setSelected] = useState([])
  const [selectedUid, setSelectedUid] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [message, setMessage] = useState("")
  const [showAlert, setShowAlert] = useState(false)
  const [severity, setSeverity] = useState("")
  const [openDialog, setOpenDialog] = useState(false)

  const onClose = () => {
    setOpenDialog(false)
    setMessage("Inscription réussie")
    setSeverity("success")
    setShowAlert(true)
  }
  // Création des colonnes dynamiques en fonction des données reçues
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
      const newSelected = data.map((n) => n._id)
      //   const newSelectedUid = data.map((n) => n._id)
      console.log(data)

      setSelected(newSelected)
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
    console.log(selected)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }
  const handleAdd = () => {}
  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        alert("Aucun élément sélectionné pour suppression !")
        return
      }
      console.log("selected", selected)

      for (const id of selected) {
        const res = await axiosInstance.delete(
          `http://localhost:5000/api/${coll}/${id}`
        )
        setMessage(res.data.message)
        setSeverity("success")
        setShowAlert(true)
      }

      setSelected([])

      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      if (error.response) {
        setMessage(
          error.response.data.message || "Erreur lors de la suppression."
        )
        setSeverity("error")
        setShowAlert(true)
      } else {
        alert("Une erreur s'est produite : " + error.message)
      }
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
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              headCells={headCells}
            />
            <TableBody>
              {visibleRows.map((row) => {
                const isItemSelected = selected.includes(row._id)

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={() => handleRowSelect(row._id)}
                        inputProps={{
                          "aria-labelledby": `enhanced-table-checkbox-${row._id}`,
                        }}
                      />
                    </TableCell>
                    {headCells.map((cell) => (
                      <TableCell
                        key={cell.id}
                        align={cell.numeric ? "right" : "left"}
                      >
                        {row[cell.id]}
                      </TableCell>
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
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Supprimer
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenDialog(true)}
        >
          Ajouter
        </Button>
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
        <DialogContent>
          <SignUpForm onClose={onClose} admin={true} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

BasicTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  coll: PropTypes.string.isRequired,
  onDataChange: PropTypes.func,
  headerMapping: PropTypes.object,
}
