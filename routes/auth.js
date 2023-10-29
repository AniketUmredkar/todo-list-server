const express = require("express");
const authController = require("../controllers/auth");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/sign-up", authController.signUp);

router.post("/login", upload.none(), authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
