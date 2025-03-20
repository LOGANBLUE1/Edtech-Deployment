import {getAllCourses} from "../../../../services/operations/courseDetailsAPI";
import { useEffect, useState } from "react";
import CoursesTable from "../InstructorCourses/CoursesTable";

export default function AllCourses(){
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        ;(async () => {
            try {
                const res = await getAllCourses();
                console.log("Course : ",res)
                setCourses(res)
            } catch (error) {
                console.log("Could not fetch Course Details")
            }
        })()
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="w-11/12">
                <div className="mb-14 flex justify-between">
                    <h1 className={`text-3xl font-medium text-richblack`}>My Courses</h1>
                </div>
                {courses && <CoursesTable courses={courses} setCourses={setCourses} getCourses={getAllCourses}/>}
            </div>
        </div>
    )
}