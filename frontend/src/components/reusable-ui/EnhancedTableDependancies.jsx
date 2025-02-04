import { useState, useMemo } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Switch from "@mui/material/Switch"
import EditIcon from "@mui/icons-material/Edit"
import { Alert, Button, IconButton, Snackbar } from "@mui/material"

import ModalDependancies from "./ModalDependancies" // Import du composant modal
import { useEffect } from "react"
import axiosInstance from "../../axiosConfig"

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

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props

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
            inputProps={{
              "aria-label": "select all rows",
            }}
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
        <TableCell>Actions</TableCell>
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

export default function EnhancedTable({
  data,
  coll,
  onDataChange,
  endpoints,
  headerMapping,
}) {
  const [message, setMessage] = useState("") // Stocke le message d'erreur
  const [showAlert, setShowAlert] = useState(false) // Gère la visibilité de l'alerte
  const [severity, setSeverity] = useState("")
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState(Object.keys(data[0] || [])[0] || "")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dropdownData, setDropdownData] = useState({})
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const fetchedData = {}
        for (const endpoint of endpoints) {
          const response = await axiosInstance.get(endpoint)
          console.log(`Réponse API pour ${endpoint}:`, response.data) // 🔍 Ajoute ce log
          fetchedData[endpoint] = response.data
        }
        setDropdownData(fetchedData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error)
      }
    }

    if (endpoints.length) {
      fetchDropdownData()
    }
  }, [])
  const headCells = data.length
    ? Object.keys(data[0]).map((key) => ({
        id: key,
        numeric: typeof data[0][key] === "number",
        disablePadding: false,
        label: headerMapping[key] || key.charAt(0).toUpperCase() + key.slice(1), // Utilise headerMapping pour les labels
      }))
    : []

  // État pour gérer la modal
  const [openModal, setOpenModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  // Générer un objet vide basé sur la structure
  const generateEmptyObject = () => {
    if (data.length === 0) return {}
    const firstItem = data[0]
    const emptyObject = {}
    Object.keys(firstItem).forEach((key) => {
      emptyObject[key] = key === "_id" ? undefined : "" // `_id` reste vide
    })
    return emptyObject
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n._id)
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

  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        alert("Aucun élément sélectionné pour suppression !")
        return
      }

      for (const id of selected) {
        const res = await axiosInstance.delete(
          `http://localhost:5000/api/${coll}/${id}`
        )
        //(`Élément avec l'ID ${id} supprimé`)
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
      } else if (error.request) {
        alert(
          "Impossible de contacter le serveur. Vérifiez votre connexion réseau."
        )
      } else {
        alert("Une erreur s'est produite : " + error.message)
      }
    }
  }

  const handleOpenModalForEdit = (row) => {
    setSelectedRow(row)
    setOpenModal(true)
  }

  const handleOpenModalForAdd = () => {
    const emptyObject = generateEmptyObject()
    setSelectedRow(emptyObject)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleModalSubmit = async (updatedData) => {
    try {
      if (updatedData._id) {
        await axiosInstance.put(
          `http://localhost:5000/api/${coll}/${updatedData._id}`,
          updatedData
        )
        //("Données mises à jour :", updatedData)
      } else {
        await axiosInstance.post(
          `http://localhost:5000/api/${coll}`,
          updatedData
        )
        //("Nouvelle donnée ajoutée :", updatedData)
      }

      alert("Opération réussie !")
      setOpenModal(false)

      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Erreur lors de l'opération :", error)
      alert("Erreur lors de l'opération !")
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
  console.count("Console log exécuté")
  console.log("dropdownData from enhencedtable", dropdownData)
  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? "small" : "medium"}>
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
              {visibleRows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selected.includes(row._id)}
                      onChange={() => handleRowSelect(row._id)}
                    />
                  </TableCell>
                  {headCells.map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof row[cell.id] === "object" && row[cell.id] !== null
                        ? row[cell.id].nom || "N/A"
                        : row[cell.id]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleOpenModalForEdit(row)}>
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
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) =>
            setRowsPerPage(parseInt(event.target.value, 10))
          }
        />
      </Paper>
      <FormControlLabel
        control={
          <Switch
            checked={dense}
            onChange={(event) => setDense(event.target.checked)}
          />
        }
        label="Dense padding"
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Supprimer
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpenModalForAdd}
        >
          Ajouter
        </Button>
      </Box>
      {selectedRow && (
        <ModalDependancies
          open={openModal}
          onClose={handleCloseModal}
          objectData={selectedRow}
          dropdownData={dropdownData}
          onSubmit={(updatedData) => {
            handleModalSubmit(updatedData)
            setOpenModal(false)
          }}
        />
      )}
    </Box>
  )
}

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  coll: PropTypes.string.isRequired,
  onDataChange: PropTypes.func,
  endpoints: PropTypes.arrayOf(PropTypes.string).isRequired,
  headerMapping: PropTypes.object, // Correspondance clé -> libellé
}
