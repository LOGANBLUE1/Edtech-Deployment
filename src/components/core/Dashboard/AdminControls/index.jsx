import DeleteUser from "./DeleteUser"
import CreateCategory from "./CreateCategory"
import DeleteCategory from "./DeleteCategory"

export default function Controls() {
    return (
        <div className="space-y-6">
            <DeleteUser/>
            <CreateCategory/>
            <DeleteCategory/>
            {/* Make admin api */}
        </div>
    )
}