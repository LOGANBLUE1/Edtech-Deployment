export const ACCOUNT_TYPE = {
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  ADMIN: "Admin",
  ALL: "All",
  DEFAULT: "Default"
}

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
}

export const COURSE_PRICE_TYPE = {
  FREE: "Free",
  PAID: "Paid",
}

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};

export const IS_LOCALHOST = process.env.REACT_APP_BASE_URL === "http://localhost:4000/api/v1";