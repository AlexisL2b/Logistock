import { io } from "socket.io-client"

// Créez une instance Socket.IO avec une configuration avancée
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // Utilise uniquement WebSocket pour des performances optimales
  autoConnect: true, // Connexion automatique
  reconnection: true, // Autorise les tentatives de reconnexion
  reconnectionAttempts: 5, // Limite le nombre de tentatives de reconnexion
  reconnectionDelay: 1000, // Délai entre les tentatives (en ms)
})

// Écoute des erreurs
socket.on("connect_error", (error) => {
  console.error("Erreur de connexion à Socket.IO :", error)
})

// Écoute de la reconnexion
socket.on("reconnect", (attempt) => {
  console.log(`Reconnecté à Socket.IO après ${attempt} tentative(s)`)
})

// Exportez l'instance Socket.IO
export default socket
