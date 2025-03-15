import axios from "axios"
import axiosInstance from "../../axiosConfig"

export const getUsers = async () => {
  return await axiosInstance.get("https://intranet.logistock/api/users/")
}
export const getBuyers = async () => {
  return await axiosInstance.get("https://intranet.logistock/api/users/buyers")
}

export const updateUser = async (userId, userUpdates) => {
  return await axiosInstance.put(
    `https://intranet.logistock/api/users/${userId}`,
    userUpdates
  )
}

export const deleteUser = async (userId) => {
  return await axiosInstance.delete(
    `https://intranet.logistock/api/users/${userId}`
  )
}
export const createUser = async (userData) => {
  return await axios.post("https://intranet.logistock/api/users/", userData)
}
