const express = require("express");
const {
    signInController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
} = require("../controllers/auth");

const router = express.Router();

router.post("/sign-in", signInController);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password", resetPasswordController);

module.exports = router;
