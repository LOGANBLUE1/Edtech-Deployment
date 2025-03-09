import { toast } from "react-hot-toast"
import { categories, catalogData } from "../apis"
import { apiConnector } from "../apiConnector"
import { HTTP_METHODS } from "../../utils/constants"

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(HTTP_METHODS.POST, catalogData.CATALOGPAGEDATA_API,
      {categoryId: categoryId}
    )

    if (!response?.success) {
      throw new Error("Could Not Fetch Catagory page data.")
    }
    result = response?.data
    result.success = response?.success;
  } catch (error) {
    console.log("CATALOGPAGEDATA_API API ERROR............", error)
    toast.error(error.message)
    result = error.response
  }
  toast.dismiss(toastId)
  return result
}


export const getAllCategories = async () => {
  let result = null;
  try {
    const response = await apiConnector(HTTP_METHODS.GET, categories.CATEGORIES_API)
    if (!response?.success) {
      throw new Error("Could Not get All categories data.")
    }
    result = response?.data
  } catch (error) {
    console.log("CATEGORIES_API API ERROR............", error)
    toast.error(error.message)
    result = error.response
  }
  return result
}
