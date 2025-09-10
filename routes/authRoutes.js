const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middleware/auth"); // make sure the path is correct

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", auth(), authController.profile); // ✅ add auth()

module.exports = router;
