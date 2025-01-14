import React from "react"
import PropTypes from "prop-types"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"

export default function Menu({ links, onLinkClick }) {
  return (
    <List>
      {links.map(({ path, label, icon }, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton onClick={() => onLinkClick(path)}>
            {/* Icône */}
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            {/* Libellé */}
            <ListItemText primary={label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

Menu.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired, // Chemin unique du lien
      label: PropTypes.string.isRequired, // Texte du lien
      icon: PropTypes.node, // Icône du lien
    })
  ).isRequired,
  onLinkClick: PropTypes.func.isRequired, // Fonction appelée sur clic
}
