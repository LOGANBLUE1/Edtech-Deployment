import { useState } from "react";
import { useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import ControlsTemplate from "./ControlsTemplate";
import { createCategory } from "../../../../services/operations/adminAPI";
import { allowOnlyAlphabet } from "../../../../utils/utils";

export default function CreateCategory() {
    const {token} = useSelector((state) => state.auth)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function createCat() {
        if (!name || !description) {
            toast.error("Please enter a name and description.");
            return;
        }
        const res = await createCategory(token, name, description)
    }

    return (
        <ControlsTemplate onSubmit={createCat} text="Create category" url="/admin/createCategory">
            <div className="flex flex-col gap-y-3">
                <div className="flex justify-start items-center gap-x-2">
                    <label htmlFor="name" className="text-richblack-300 w-1/5">Name: </label>
                    <input
                        required
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        className="form-style"
                        onKeyDown={allowOnlyAlphabet}
                    />
                </div>
                <div className="flex justify-start items-center gap-x-2">
                    <label htmlFor="description" className="text-richblack-300 w-1/5">Description: </label>
                    <input
                        required
                        type="text"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className="form-style"
                    />
                </div>
            </div>
        </ControlsTemplate>
    );
}
