const express = require("express");
const authController = require("../controllers/auth");
const multer = require("multer");
const upload = multer();
const { check } = require("express-validator");

const router = express.Router();

router.post(
    "/sign-up",
    upload.none(),
    check("email").isEmail().withMessage("Invalid email address"),
    authController.signUp
);

router.post(
    "/login",
    upload.none(),
    check("email").isEmail().withMessage("Invalid email address"),
    authController.login
);

router.post("/logout", authController.logout);

router.post(
    "/forgot-password",
    upload.none(),
    check("email").isEmail().withMessage("Invalid email address"),
    authController.forgotPassword
);

router.post("/reset-password", upload.none(), authController.resetPassword);

module.exports = router;
