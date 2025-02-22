import { useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import IconBtn from "../../../Common/IconBtn";
import { deleteUserPermanently } from "../../../../services/operations/adminAPI";
import ControlsTemplate from "./ControlsTemplate";

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
        <ControlsTemplate onSubmit={deleteUser} text="Delete a User" url="/admin/deleteUserPermanently">
            <div className="flex justify-start items-center gap-x-2">
                <label htmlFor="userId" className="text-richblack-300">User ID:</label>
                <input
                    required
                    type="text"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter userId"
                    className="form-style"
                />
            </div>
        </ControlsTemplate>
    );
}
