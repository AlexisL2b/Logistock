import React from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { Link } from "react-router"

function Menu({ links }) {
  return (
    <Box
      sx={{
        width: 250,
        backgroundColor: "background.paper",
        borderRadius: 2,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        boxShadow: 1,
        p: 2,
      }}
    >
      <List>
        {links.map((link, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              sx={{
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "primary.light",
                  color: "white",
                },
              }}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

Menu.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ).isRequired,
}

export default Menu
