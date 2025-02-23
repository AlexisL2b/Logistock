import React, { useState } from "react"
import PropTypes from "prop-types"
import { Tabs, Tab, Box, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"

// Composant pour chaque panneau/tab
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

// Fonction pour gérer les attributs d'accessibilité
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

// Composant principal avec gestion responsive
export default function TabsWithPanels({ tabs }) {
  const [value, setValue] = useState(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 3 }}>
      {/* Onglets avec gestion responsive */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.default",
          borderRadius: 2,
          overflowX: isMobile ? "auto" : "visible",
          "&::-webkit-scrollbar": { display: "none" }, // Cacher scrollbar sur mobile
          display: "flex",
          justifyContent: "center", // 🔥 Centrer les onglets
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          aria-label="dynamic tabs example"
          sx={{
            "& .MuiTabs-flexContainer": {
              justifyContent: "center", // 🔥 Centre les onglets horizontalement
            },
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main, // Couleur de l'indicateur actif
            },
            "& .MuiTab-root": {
              fontWeight: "bold",
              textTransform: "none",
              "&.Mui-selected": {
                color: theme.palette.primary.main, // Couleur de l'onglet actif
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      {/* Panneaux de contenu */}
      {tabs.map((tab, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {tab.component}
        </CustomTabPanel>
      ))}
    </Box>
  )
}

TabsWithPanels.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Le label de l'onglet
      component: PropTypes.node.isRequired, // Le composant à afficher
    })
  ).isRequired,
}
