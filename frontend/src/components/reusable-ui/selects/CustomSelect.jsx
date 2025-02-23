import { FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import PropTypes from "prop-types"

const CustomSelect = ({
  inputLabelId,
  inputLabel,
  selectId,
  selectLabel,
  defaultMenuItemLabel,
  menuItems,
  selectedValue,
  onChange,
  valueKey = "_id", // ✅ Ajout d'une nouvelle prop avec "_id" comme valeur par défaut
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={inputLabelId}>{inputLabel}</InputLabel>
      <Select
        labelId={inputLabelId}
        id={selectId}
        label={selectLabel}
        value={selectedValue}
        onChange={onChange}
      >
        <MenuItem value="">{defaultMenuItemLabel}</MenuItem>
        {menuItems.map((item) => (
          <MenuItem key={item._id} value={item[valueKey]}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

CustomSelect.propTypes = {
  inputLabelId: PropTypes.string.isRequired,
  inputLabel: PropTypes.string.isRequired,
  selectId: PropTypes.string.isRequired,
  selectLabel: PropTypes.string.isRequired,
  defaultMenuItemLabel: PropTypes.string.isRequired,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  valueKey: PropTypes.string, // ✅ Permet de spécifier une autre clé pour la value
}

export default CustomSelect
