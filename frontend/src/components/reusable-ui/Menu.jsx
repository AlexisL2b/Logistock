import React from "react"
import PropTypes from "prop-types"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

export default function Menu({ links, onLinkClick }) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <List
      sx={{
        display: "flex",
        flexDirection: "column", // Colonne sur mobile, ligne sur desktop
        alignItems: isMobile ? "stretch" : "center",
        justifyContent: isMobile ? "flex-start" : "center",
        padding: 0,
      }}
    >
      {links.map(({ path, label, icon }, index) => (
        <ListItem
          key={index}
          disablePadding
          sx={{
            width: isMobile ? "100%" : "auto", // Pleine largeur sur mobile
          }}
        >
          <ListItemButton
            onClick={() => onLinkClick(path)}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "row" : "column", // Icône en haut sur desktop, à gauche sur mobile
              alignItems: "center",
              justifyContent: isMobile ? "flex-start" : "center",
              padding: "10px 20px",
              borderRadius: "8px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "&:active": {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            {/* Icône */}
            {icon && (
              <ListItemIcon
                sx={{
                  minWidth: "unset",
                  mr: isMobile ? 2 : 0, // Marge à droite sur mobile, centrée sur desktop
                  mb: isMobile ? 0 : 1, // Marge en bas uniquement sur desktop
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </ListItemIcon>
            )}
            {/* Libellé */}
            <ListItemText
              primary={label}
              sx={{
                textAlign: isMobile ? "left" : "center",
                fontSize: isMobile ? "1rem" : "0.9rem",
                fontWeight: 500,
              }}
            />
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
