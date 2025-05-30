export const endpoints = {
  SENDOTP_API: "/auth/sendotp",
  SIGNUP_API: "/auth/signup",
  LOGIN_API: "/auth/login",
  GOOGLE_LOGIN_API: "/auth/google",
  RESETPASSTOKEN_API: "/auth/reset-password-token",
  RESETPASSWORD_API: "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: "/payment/capturePayment",
  COURSE_VERIFY_API: "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: "/course/getAllCourses",
  COURSE_DETAILS_API: "/course/getCourseDetails",
  EDIT_COURSE_API: "/course/editCourse",
  CREATE_COURSE_API: "/course/createCourse",
  CREATE_SECTION_API: "/course/addSection",
  CREATE_SUBSECTION_API: "/course/addSubSection",
  UPDATE_SECTION_API: "/course/updateSection",
  UPDATE_SUBSECTION_API: "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: "/course/getInstructorCourses",
  DELETE_SECTION_API: "/course/deleteSection",
  DELETE_SUBSECTION_API: "/course/deleteSubSection",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
   "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: "/course/updateCourseProgress",
  CREATE_RATING_API: "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: "/course/getReviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: "/profile/updateProfile",
  CHANGE_PASSWORD_API: "/auth/changepassword",
  DELETE_PROFILE_API: "/profile/deleteProfile",
}

export const adminEndpoints = {
  DELETE_PROFILE_PERMANENTLY_API: "/admin/deleteUserPermanently",
  CREATE_CATEGORY_API: "/admin/createCategory",
  DELETE_CATEGORY_API: "/admin/deleteCategory",
  GET_ALL_USER_EMAILS: "/admin/users",
  DELETE_COURSE_ADMIN_API: "/admin/deleteCourse",
}