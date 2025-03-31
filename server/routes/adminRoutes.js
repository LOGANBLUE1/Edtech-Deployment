const express = require("express")
const router = express.Router()
const { auth , isAdmin, isInstructorOrAdmin } = require("../middleware/auth")
const { deleteUserPermanently } = require("../controllers/profile") 
const { createCategory, deleteCategory } = require("../controllers/category")
// const { getAllEmails } = require("../controllers/auth")
const { getAllUsers } = require("../controllers/auth")
const { deleteCourse } = require("../controllers/course")

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************
// Delete User Account Permanently
router.delete("/deleteUserPermanently", auth, isAdmin, deleteUserPermanently)

router.post("/createCategory", auth, isAdmin, createCategory)

// router.get("/users", auth, isAdmin, getAllEmails)

router.get("/users", auth, isAdmin, getAllUsers)

router.post("/deleteCategory", auth, isAdmin, deleteCategory)

router.delete("/deleteCourse", auth, isInstructorOrAdmin, deleteCourse)

module.exports = router