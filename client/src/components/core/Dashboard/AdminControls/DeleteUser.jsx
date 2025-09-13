import { useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import IconBtn from "../../../Common/IconBtn";
import { deleteUserPermanently } from "../../../../services/operations/adminAPI";
import ControlsTemplate from "./ControlsTemplate";

export default function DeleteUser() {
    const { token } = useSelector((state) => state.auth)
    const [field, setField] = useState("");

    async function deleteUser() {
        if (!field) {
            toast.error("Please enter a user id/email.");
            return;
        }
        const res = await deleteUserPermanently(token, field)
    }

    return (
        <ControlsTemplate onSubmit={deleteUser} text="Delete a User" url="/admin/deleteUserPermanently">
            <div className="flex justify-start items-center gap-x-2">
                <label htmlFor="field" className="text-richblack-300 w-1/5">field: </label>
                <input
                    required
                    type="text"
                    name="field"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Enter user id/email"
                    className="form-style"
                />
            </div>
        </ControlsTemplate>
    );
}
