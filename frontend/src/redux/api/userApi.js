import axios from "axios"
import axiosInstance from "../../axiosConfig"

export const getUsers = async () => {
  return await axiosInstance.get("http://localhost:5000/api/users/")
}
export const getBuyers = async () => {
  return await axiosInstance.get("http://localhost:5000/api/users/buyers")
}

export const updateUser = async (userId, userUpdates) => {
  return await axiosInstance.put(
    `http://localhost:5000/api/users/${userId}`,
    userUpdates
  )
}

export const deleteUser = async (userId) => {
  return await axiosInstance.delete(`http://localhost:5000/api/users/${userId}`)
}
export const createUser = async (userData) => {
  return await axios.post("http://localhost:5000/api/users/", userData)
}
