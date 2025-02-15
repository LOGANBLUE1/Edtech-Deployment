import { useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import IconBtn from "../../../Common/IconBtn";
import { deleteUserPermanently } from "../../../../services/operations/adminAPI";

export default function DeleteUser() {
    const { token } = useSelector((state) => state.auth)
    const [userId, setUserId] = useState("");

    async function deleteUser() {
        if (!userId) {
            toast.error("Please enter a user ID.");
            return;
        }
        else if(userId.length < 24){
            toast.error("Please enter a valid user ID.")
            return;
        }
        const res = await deleteUserPermanently(token, userId)
        if(res?.success){
            toast.success(`User:${res.email} deleted Successfully.`)
        }
    }

    return (
        <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
            <div className="flex items-center gap-x-4">
                <div className="space-y-1">
                    <p className="text-lg font-semibold text-richblack-5">
                        Delete a User
                    </p>
                    <p className="text-sm text-richblack-300">
                        /deleteUserPermanently
                    </p>
                </div>
            </div>
            <div>
                <input
                    required
                    type="text"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                    className="form-style w-full"
                />
            </div>
            <IconBtn
                text="Execute"
                onclick={deleteUser}
            />
        </div>
    );
}
