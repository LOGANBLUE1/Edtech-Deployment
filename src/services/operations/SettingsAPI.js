import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"
import { HTTP_METHODS } from "../../utils/constants"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        HTTP_METHODS.PUT,
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      // console.log("UPDATE_DISPLAY_PICTURE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    } finally {
      toast.dismiss(toastId)
    }
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.PUT, UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("UPDATE_PROFILE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      const userImage = response.data.image
        ? response.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`
      dispatch(
        setUser({ ...response.data, image: userImage })
      )
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API ERROR............", error)
      toast.error("Could Not Update Profile")
    } finally {
      toast.dismiss(toastId)
    }
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("CHANGE_PASSWORD_API RESPONSE............", response)

    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API ERROR............", error)
    toast.error(error.response.message)
  } finally {
    toast.dismiss(toastId)
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(HTTP_METHODS.DELETE, DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("DELETE_PROFILE_API RESPONSE............", response)

      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR............", error)
      toast.error("Could Not Delete Profile")
    } finally {
      toast.dismiss(toastId)
    }
  }
}
