import { Box, Button, Drawer, IconButton } from "@mui/material"
import Menu from "../../../reusable-ui/Menu" // Composant Menu
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { logoutUser } from "../../../../redux/slices/authSlice"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import MenuIcon from "@mui/icons-material/Menu"
import Orders from "./main/order/Orders"
import Main from "./main/Main"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Profile from "../user/main/profile/Profile"

export default function DashboardLogistician() {
  const [activeComponent, setActiveComponent] = useState("profile")
  const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const links = [
    {
      path: "orders",
      label: "Commandes",
      icon: <AccountTreeIcon />,
      component: <Orders />, // Composant à afficher
    },
    {
      path: "profile",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />, // Composant à afficher
    },
  ]
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component

  const handleLogout = () => {
    dispatch(logoutUser())
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {isMobile && (
        <Drawer
          anchor="left"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <Box sx={{ width: 250, padding: 2 }}>
            <Menu
              links={links}
              onLinkClick={(path) => {
                setActiveComponent(path)
                setOpenDrawer(false)
              }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ mt: "auto" }}
            >
              Déconnexion
            </Button>
          </Box>
        </Drawer>
      )}

      {!isMobile && (
        <Box
          sx={{
            width: "250px",
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            padding: 2,
          }}
        >
          <Menu links={links} onLinkClick={setActiveComponent} />
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              mt: "auto",
              borderColor: "transparent",
              "&:hover": {
                borderColor: "red",
              },
            }}
          >
            Déconnexion
          </Button>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {/* Header avec menu burger (gauche) */}
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <IconButton onClick={() => setOpenDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Affichage du composant actif */}
        <Main>{activeElement}</Main>
      </Box>
    </Box>
  )
}
