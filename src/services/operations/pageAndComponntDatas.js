import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { catalogData } from "../apis"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      {
        categoryId: categoryId,
      }
    )
    if (!response?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response
  }
  toast.dismiss(toastId)
  return result
}


export const getAllCategories = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = apiConnector("GET", categories.CATEGORIES_API)
    if (!response?.success) {
      throw new Error("Could Not All categories data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATEGORIES_API API ERROR............", error)
    toast.error(error.message)
    result = error.response
  }
  toast.dismiss(toastId)
  return result
}
