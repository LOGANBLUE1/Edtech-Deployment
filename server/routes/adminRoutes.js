const express = require("express")
const router = express.Router()
const { auth , isAdmin } = require("../middleware/auth")
const {deleteUserPermanently} = require("../controllers/profile") 

// ********************************************************************************************************
//                                      Admin routes
// ********************************************************************************************************
// Delete User Account Permanently
router.delete("/deleteUserPermanently", auth, isAdmin, deleteUserPermanently)

module.exports = router