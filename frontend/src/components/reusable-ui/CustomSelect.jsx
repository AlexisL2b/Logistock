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
          <MenuItem key={item._id} value={item._id}>
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
}

export default CustomSelect
