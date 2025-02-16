import { useState, useMemo, useEffect } from "react"
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
import { Button, IconButton } from "@mui/material"
import BasicModal from "../../../reusable-ui/BasicModal"
import ModalProduct from "./ModalProduct"
import axiosInstance from "../../../../../../axiosConfig"

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

export default function EnhancedTable({ data, coll, onDataChange, endpoints }) {
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState(Object.keys(data[0] || [])[0] || "")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [dropdownData, setDropdownData] = useState({}) // État pour les données des listes déroulantes
  const [openModal, setOpenModal] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  // Récupérer les données pour chaque endpoint et les stocker dans dropdownData
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const fetchedData = {}
        for (const endpoint of endpoints) {
          const response = await axiosInstance.get(endpoint)
          fetchedData[endpoint] = response.data // Associez les données au nom du endpoint
        }
        setDropdownData(fetchedData)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données des endpoints :",
          error
        )
      }
    }

    if (endpoints.length) {
      fetchDropdownData()
    }
  }, [endpoints])
  console.log("dropdownData", dropdownData)

  // endpoints.forEach((endpoint) => {
  //(dropdownData)
  // })

  const headCells = data.length
    ? Object.keys(data[0]).map((key) => ({
        id: key,
        numeric: typeof data[0][key] === "number",
        disablePadding: false,
        label: key.charAt(0).toUpperCase() + key.slice(1),
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
  const handleDelete = async () => {
    try {
      if (selected.length === 0) {
        alert("Aucun élément sélectionné pour suppression !")
        return
      }

      const confirmation = window.confirm(
        `Êtes-vous sûr de vouloir supprimer ${selected.length} élément(s) ?`
      )
      if (!confirmation) return

      for (const id of selected) {
        const url = `http://localhost:5000/api/${coll}/${id}`
        //("DELETE URL:", url) // Debug

        await axiosInstance.delete(url)
        //(`Élément avec l'ID ${id} supprimé`)
      }

      alert("Suppression réussie !")
      setSelected([])

      if (onDataChange) {
        onDataChange() // Rafraîchir les données après suppression
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.response || error)
      alert("Erreur lors de la suppression !")
    }
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

  const generateEmptyObject = () => {
    if (data.length === 0) return {}
    const firstItem = data[0] // Utilise la première ligne comme modèle
    const emptyObject = {}
    Object.keys(firstItem).forEach((key) => {
      emptyObject[key] = "" // Initialise tous les champs avec une chaîne vide
    })
    return emptyObject
  }

  const handleModalSubmit = async (updatedData) => {
    try {
      // Remplacez les chaînes vides par null
      const cleanedData = Object.keys(updatedData).reduce((acc, key) => {
        acc[key] = updatedData[key] === "" ? null : updatedData[key]
        return acc
      }, {})

      //("Données nettoyées :", cleanedData)

      if (cleanedData._id) {
        const url = `http://localhost:5000/api/${coll}/${cleanedData._id}`
        //("PUT URL:", url)

        await axiosInstance.put(url, cleanedData)
        //("Données mises à jour :", cleanedData)
      } else {
        const url = `http://localhost:5000/api/${coll}`
        //("POST URL:", url)

        await axiosInstance.post(url, cleanedData)
        //("Nouvelle donnée ajoutée :", cleanedData)
      }

      alert("Opération réussie !")
      setOpenModal(false)

      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Erreur lors de l'opération :", error.response || error)
      if (error.response?.status === 404) {
        alert("Ressource non trouvée. Vérifiez l'URL ou l'identifiant.")
      } else {
        alert("Erreur lors de l'opération !")
      }
    }
  }

  const visibleRows = useMemo(
    () =>
      [...data]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, order, orderBy, page, rowsPerPage]
  )

  return (
    <Box sx={{ width: "100%" }}>
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
                        {typeof row[cell.id] === "object" &&
                        row[cell.id] !== null
                          ? row[cell.id].name || "N/A" // Si c'est un objet, affichez la propriété "nom"
                          : row[cell.id]}{" "}
                        {/* Sinon, affichez directement la valeur */}
                      </TableCell>
                    ))}

                    <TableCell>
                      <IconButton onClick={() => handleOpenModalForEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
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
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
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
        <ModalProduct
          open={openModal}
          onClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          objectData={selectedRow}
          dropdownData={dropdownData} // Pass dropdown data to the modal
        />
      )}
    </Box>
  )
}

EnhancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  coll: PropTypes.string,
  onDataChange: PropTypes.func,
  endpoints: PropTypes.arrayOf(PropTypes.string).isRequired,
}
