import { useState } from "react"
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle"

import MenuIcon from "@mui/icons-material/Menu"
import LogoutIcon from "@mui/icons-material/Logout"

import { useDispatch } from "react-redux"
import { logoutUser } from "../../../../redux/slices/authSlice"
import Menu from "../../../reusable-ui/Menu"

import Users from "./main/users/Users"
import Main from "./main/main"
import Profile from "../user/main/profile/Profile"

export default function DashboardAdmin() {
  const [activeComponent, setActiveComponent] = useState("dashboard")
  const [openDrawer, setOpenDrawer] = useState(false)
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const handleLogout = () => {
    dispatch(logoutUser())
  }
  const links = [
    {
      path: "dashboard",
      label: "Profile",
      icon: <AccountCircleIcon />,
      component: <Profile />,
    },
    {
      path: "users",
      label: "Utilisateur",
      icon: <SupervisedUserCircleIcon />,
      component: <Users />,
    },
  ]
  const activeElement = links.find(
    (link) => link.path === activeComponent
  )?.component
  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Drawer (menu latéral caché sur mobile) */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box
          sx={{
            width: 250,
            padding: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Menu
            links={links}
            onLinkClick={(path) => {
              setActiveComponent(path)
              setOpenDrawer(false) // Ferme le menu après sélection
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

      {!isMobile && (
        <Box
          sx={{
            width: "250px",
            bgcolor: "background.paper",
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            padding: 2,
            justifyContent: "center",
          }}
        >
          <Menu links={links} onLinkClick={setActiveComponent} />
          <Button
            startIcon={<LogoutIcon />}
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ mt: "auto" }}
          >
            Déconnexion
          </Button>
        </Box>
      )}

      {/* Contenu principal */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2, position: "relative" }}>
        {/* Bouton menu burger sur mobile (FIXÉ EN HAUT À GAUCHE) */}
        {isMobile && (
          <IconButton
            onClick={() => setOpenDrawer(true)}
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "black",
              backgroundColor: "white",
              boxShadow: 2,
              zIndex: 1000, // Pour rester au-dessus du contenu
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Espace pour éviter que le menu burger cache le contenu */}
        <Box sx={{ mt: isMobile ? 6 : 0 }}>
          <Main>{activeElement}</Main>
        </Box>
      </Box>
    </Box>
  )
}
