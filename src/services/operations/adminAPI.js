import { toast } from "react-hot-toast"
import { adminEndpoints } from "../apis"
import { apiConnector } from "../apiConnector"
import { HTTP_METHODS } from "../../utils/constants"

const {
    DELETE_PROFILE_PERMANENTLY_API,
    CREATE_CATEGORY_API,
    DELETE_CATEGORY_API
} = adminEndpoints

export const deleteUserPermanently = async (token, field) => {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector(HTTP_METHODS.DELETE, DELETE_PROFILE_PERMANENTLY_API, {field:field}, {
            Authorization: `Bearer ${token}`,
        })
        // console.log("DELETE_PROFILE_API RESPONSE............", response)

        if (!response.success) {
            toast.error(response.message)
            return 
        }
        toast.success("(A) Profile Deleted Successfully")
        return response
    } catch (error) {
        console.log("DELETE_PROFILE_API ERROR............", error)
        toast.error("(A) Could Not Delete Profile")
    } finally {
        toast.dismiss(toastId)
    }
}

export const createCategory = async (token, name, description) => {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", CREATE_CATEGORY_API, {name: name, description: description}, {
            Authorization: `Bearer ${token}`,
        })
        // console.log("CREATE_CATEGORY_API RESPONSE............", response)

        if (!response.success) {
            toast.error(response.message)
            return 
        }
        toast.success("(A) Category Created Successfully")
        return response
    } catch (error) {
        console.log("CREATE_CATEGORY_API ERROR............", error)
        toast.error("(A) Could Not Create Category")
    } finally {
        toast.dismiss(toastId)
    }
}

export const deleteCategory = async (token, field) => {
    const toastId = toast.loading("Loading...")
    try {
        console.log("DELETE_CATEGORY_API FIELD............", field)
        const response = await apiConnector("POST", DELETE_CATEGORY_API, {field:field}, {
            Authorization: `Bearer ${token}`,
        })
        console.log("DELETE_CATEGORY_API RESPONSE............", response)

        if (!response.success) {
            toast.error(response.message)
            return 
        }
        toast.success("(A) Category Deleted Successfully")
        return response
    } catch (error) {
        console.log("DELETE_CATEGORY_API ERROR............", error)
        toast.error("(A) Could Not Delete Category")
    } finally {
        toast.dismiss(toastId)
    }
}