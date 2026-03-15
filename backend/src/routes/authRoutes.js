const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/google", authController.googleLogin);
router.get("/google-redirect", authController.googleRedirect);
router.get("/google-callback", authController.googleCallback);

module.exports = router;
