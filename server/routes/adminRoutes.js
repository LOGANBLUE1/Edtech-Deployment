const express = require("express")
const router = express.Router()
const { auth , isAdmin } = require("../middleware/auth")
const { deleteUserPermanently } = require("../controllers/profile") 
const { createCategory } = require("../controllers/caterory")
const { getAllEmails } = require("../controllers/Auth")

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************
// Delete User Account Permanently
router.delete("/deleteUserPermanently", auth, isAdmin, deleteUserPermanently)

router.post("/createCategory", auth, isAdmin, createCategory)

router.get("/users", auth, isAdmin, getAllEmails)

module.exports = router