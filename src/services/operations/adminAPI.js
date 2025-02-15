import { toast } from "react-hot-toast"
import { adminEndpoints } from "../apis"
import { apiConnector } from "../apiConnector"

const {
    DELETE_PROFILE_PERMANENTLY_API
} = adminEndpoints

export const deleteUserPermanently = async (token, userId) => {
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("DELETE", DELETE_PROFILE_PERMANENTLY_API, {userId: userId}, {
            Authorization: `Bearer ${token}`,
        })
        // console.log("DELETE_PROFILE_API API RESPONSE............", response)

        if (!response.success) {
            toast.error(response.message)
            return 
        }
        toast.success("(A) Profile Deleted Successfully")
        return response
    } catch (error) {
        console.log("DELETE_PROFILE_API API ERROR............", error)
        toast.error("(A) Could Not Delete Profile")
    } finally {
        toast.dismiss(toastId)
    }
}