import { useEffect } from "react"
import { getAuth } from "firebase/auth"

const TestFirebase = () => {
  useEffect(() => {
    const auth = getAuth()
    // console.log(
    //   "🔍 Utilisateur Firebase immédiatement après refresh :",
    //   auth.currentUser
    // )

    setTimeout(() => {
      // console.log("⏳ Vérification après 5 secondes :", auth.currentUser)
    }, 5000)
  }, [])

  return null
}

export default TestFirebase
