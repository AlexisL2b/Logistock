import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchUserProfile } from "../../../../../../redux/slices/authSlice"
import { getAuth } from "firebase/auth"

const Profile = () => {
  const auth = getAuth()
  // auth.currentUser.getIdToken(true).then((idToken) => {
  //   //("ID Token Firebase :", idToken)
  // })
  // const dispatch = useDispatch()
  const { user, status, error } = useSelector((state) => state.auth)

  // useEffect(() => {
  //   if (status === "idle") {
  //     dispatch(fetchUserProfile())
  //   }
  // }, [dispatch, status])

  // //("user", user)
  if (user) {
    // //("user", user)
  }
  if (status === "loading") return <p>Chargement des données...</p>
  if (status === "failed") return <p>Erreur : {error}</p>

  return (
    <div>
      <h1>Profil Utilisateur</h1>
      {user && (
        <>
          <p>Nom Firebase : {user.name || "Non renseigné"}</p>
          <p>Email Firebase : {user.email || "Non renseigné"}</p>
          <p>MongoDB ID : {user._id || "Non renseigné"}</p>
          <p>Nom MongoDB : {user.nom || "Non renseigné"}</p>
        </>
      )}
    </div>
  )
}

export default Profile
