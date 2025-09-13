import StudentTable from "./StudentTable"
export default function AllCourses(){


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-11/12">
                <div className="flex flex-col justify-center items-center">
                    <h1 className={`text-3xl m-5 font-medium text-richblack-5`}>All Users</h1>
                </div>
                {/* {student && <StudentTable students={students} setCourses={setCourses}/>} */}
            </div>
        </div>
    )
}