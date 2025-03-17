import React from "react"
import { Snackbar, Alert } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { hideNotification } from "../../redux/slices/notificationSlice"

const NotificationSnackbar = () => {
  const dispatch = useDispatch()
  const { open, message, severity } = useSelector((state) => state.notification)

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => dispatch(hideNotification())}
    >
      <Alert onClose={() => dispatch(hideNotification())} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationSnackbar
