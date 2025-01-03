import { Box, Button, TextField } from "@mui/material"
import React from "react"

export default function Form({ action, onSubmit }) {
  return (
    <Box
      sx={{
        border: "solid 1px red",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
      action={action}
      onSubmit={onSubmit}
    >
      <Box className="headerForm">
        <h1>Titre du formulaire</h1>
      </Box>
      <Box
        className="fieldContainer"
        sx={{ display: "flex", justifyContent: "center" }}
        action={action}
        onSubmit={onSubmit}
      >
        <Box className="leftFieldContainer">
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue="Field 1"
            variant="filled"
            size="small"
            sx={{ margin: "5px" }}
          />
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column" }}
          className="rightFieldContainer"
        >
          <TextField
            sx={{ margin: "5px" }}
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue="Field 2"
            variant="filled"
            size="small"
          />
          <TextField
            sx={{ margin: "5px" }}
            hiddenLabel
            id="filled-hidden-label-small"
            defaultValue="Field 2"
            variant="filled"
            size="small"
          />
        </Box>
      </Box>
      <Box className="footerForm">
        <Button
          variant="contained"
          sx={{
            marginTop: 2,
            color: "primary.contrastText",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
        >
          Ajouter
        </Button>
      </Box>
    </Box>
  )
}
