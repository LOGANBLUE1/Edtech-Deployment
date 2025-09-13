import { toast } from "react-hot-toast"

// import { updateCompletedLectures } from "../../slices/viewCourseSlice"
// import { setLoading } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector"
import { adminEndpoints, courseEndpoints } from "../apis"
import { HTTP_METHODS } from "../../utils/constants"

const {
  COURSE_DETAILS_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints

const {DELETE_COURSE_ADMIN_API} = adminEndpoints

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(HTTP_METHODS.GET, GET_ALL_COURSE_API)
    if (!response?.success) {
      toast.error("Could Not Fetch Course Categories")
      return
    }
    result = response?.data
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(HTTP_METHODS.GET, COURSE_DETAILS_API+`/${courseId}`)
    // console.log("COURSE_DETAILS_API API RESPONSE............", response)

    if (!response.success) {
      toast.error(response.message)
      return
    }
    result = response
  } catch (error) {
    console.log("COURSE_DETAILS_API API ERROR............", error)
    // toast.error(error.response.message);
  } finally {
    toast.dismiss(toastId)
  }
  return result
  //   dispatch(setLoading(false));
}

// add the course details
export const addCourseDetails = async (data, token) => {
  let result = null
  // for (let [key, value] of data.entries()) {
  //   console.log("in addCourseDetails: ",key, value);
  // }
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    })
    // console.log("CREATE COURSE API RESPONSE............", response)
    if (!response?.success) {
      toast.error(response.message)
      return
    }
    toast.success("Course Details Added Successfully")
    result = response?.data
  } catch (error) {
    console.log("CREATE COURSE API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// edit the course details
export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    // console.log("EDIT COURSE API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Update Course Details")
      return
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data
  } catch (error) {
    console.log("EDIT COURSE API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// create a section
export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("CREATE SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Create Section")
      return
    }
    toast.success("Course Section Created")
    result = response?.data
  } catch (error) {
    console.log("CREATE SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// create a subsection
export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("CREATE SUB-SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Add Lecture")
      return
    }
    toast.success("Lecture Added")
    result = response?.data
  } catch (error) {
    console.log("CREATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// update a section
export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("UPDATE SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Update Section")
      return
    }
    toast.success("Course Section Updated")
    result = response?.data
  } catch (error) {
    console.log("UPDATE SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// update a subsection
export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("UPDATE SUB-SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Update Lecture")
      return
    }
    toast.success("Lecture Updated")
    result = response?.data
  } catch (error) {
    console.log("UPDATE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// delete a section
export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.DELETE, DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("DELETE SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Delete Section")
      return
    }
    toast.success("Course Section Deleted")
    result = response?.data
  } catch (error) {
    console.log("DELETE SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}
// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Delete Lecture")
      return
    }
    toast.success("Lecture Deleted")
    result = response?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// fetching all courses under a specific instructor
export const fetchInstructorCourses = async (token) => {
  let result = []
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      HTTP_METHODS.GET,
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log("INSTRUCTOR COURSES API RESPONSE............", response)
    if (!response?.success) {
      toast.error("Could Not Fetch Instructor Courses")
      return
    }
    result = response?.data
  } catch (error) {
    console.log("INSTRUCTOR COURSES API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// delete a course
export const deleteCourse = async (data, token) => {
  console.log("delete course data", data, "token", token)
  const toastId = toast.loading("Loading...")
  try {
    // console.log("delete course data", data, token, DELETE_COURSE_ADMIN_API)
    const response = await apiConnector(HTTP_METHODS.DELETE, DELETE_COURSE_ADMIN_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("DELETE COURSE API RESPONSE............", response)
    if (!response?.success) {
      // toast.error("Could Not Delete Course")
      return
    }
    toast.success("Course Deleted")
  } catch (error) {
    console.log("DELETE COURSE API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
}

// get full details of a course
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  //   dispatch(setLoading(true));
  let result = null
  try {
    const response = await apiConnector(
      HTTP_METHODS.POST,
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
    // console.log("COURSE_FULL_DETAILS_API API RESPONSE............", response)

    if (!response.success) {
      toast.error(response.message)
      return
    }
    result = response?.data
  } catch (error) {
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    // toast.error(error.response.message);
  } finally {
    toast.dismiss(toastId)
  }
  //   dispatch(setLoading(false));
  return result
}

// mark a lecture as complete
export const markLectureAsComplete = async (data, token) => {
  let result = null
  console.log("mark complete data", data)
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(HTTP_METHODS.POST, LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("MARK_LECTURE_AS_COMPLETE_API API RESPONSE............",response)

    if (!response.message) {
      toast.error(response.error)
      return
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    console.log("MARK_LECTURE_AS_COMPLETE_API API ERROR............", error)
    toast.error(error.message)
    result = false
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// create a rating for course
export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  // let success = false
  try {
    const response = await apiConnector(HTTP_METHODS.POST, CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    // console.log("CREATE RATING API RESPONSE............", response)
    if (!response?.success) {
      toast.error(response?.message)
      return
    }
    toast.success(response.message)
    // success = true
  } catch (error) {
    // success = false
    console.log("CREATE RATING API ERROR............", error)
    toast.error(error.message)
  } finally {
    toast.dismiss(toastId)
  }
  // return success
}
