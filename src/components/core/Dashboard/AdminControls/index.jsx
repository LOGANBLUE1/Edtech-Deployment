import DeleteUser from "./DeleteUser"
import CreateCategory from "./CreateCategory"

export default function Controls() {
    return (
        <div className="space-y-6">
            <DeleteUser/>
            <CreateCategory/>
        </div>
    )
}