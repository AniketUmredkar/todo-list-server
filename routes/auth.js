const express = require("express");
const authController = require("../controllers/auth");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.post("/sign-up", upload.none(), authController.signUp);

router.post("/login", upload.none(), authController.login);

router.post("/logout", authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", upload.none(), authController.resetPassword);

module.exports = router;
