import { useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { deleteCategory } from "../../../../services/operations/adminAPI";
import ControlsTemplate from "./ControlsTemplate";

export default function DeleteCategory() {
    const {token} = useSelector((state) => state.auth)
    const [field, setField] = useState("");

    async function deleteCat() {
        if (!field) {
            toast.error("Please enter a category name/field.");
            return;
        }
        console.log("FIELD............", field)
        const res = await deleteCategory(token, field)
        if(res?.success){
            toast.success(`User:${res.email} deleted Successfully.`)
        }
    }

    return (
        <ControlsTemplate onSubmit={deleteCat} text="Delete a Category" url="/admin//deleteCategory">
            <div className="flex justify-start items-center gap-x-2">
                <label htmlFor="field" className="text-richblack-300 w-1/5">field: </label>
                <input
                    required
                    type="text"
                    name="field"
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    placeholder="Enter category id/name"
                    className="form-style"
                />
            </div>
        </ControlsTemplate>
    );
}
