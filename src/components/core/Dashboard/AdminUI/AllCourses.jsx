import {getAllCourses} from "../../../../services/operations/courseDetailsAPI";
import { useEffect, useState } from "react";
import CoursesTable from "../InstructorCourses/CoursesTable";

export default function AllCourses(){
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        ;(async () => {
            try {
                const res = await getAllCourses();
                setCourses(res)
            } catch (error) {
                console.log("Could not fetch Course Details")
            }
        })()
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-11/12">
                <div className="flex flex-col justify-center items-center">
                    <h1 className={`text-3xl m-5 font-medium text-richblack-5`}>All Courses</h1>
                </div>
                {courses && <CoursesTable courses={courses} setCourses={setCourses} getCourses={getAllCourses} isAdmin={true}/>}
            </div>
        </div>
    )
}