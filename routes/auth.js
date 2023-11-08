const express = require("express");
const authController = require("../controllers/auth");
const { check } = require("express-validator");

const router = express.Router();

router.post("/sign-up", check("email").isEmail().withMessage("Invalid email address"), authController.signUp);

router.post("/login", check("email").isEmail().withMessage("Invalid email address"), authController.login);

router.post(
    "/forgot-password",
    check("email").isEmail().withMessage("Invalid email address"),
    authController.forgotPassword
);

router.post("/reset-password", authController.resetPassword);

module.exports = router;
