const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail, sendResetPasswordEmail } = require("../utils/aws");
const crypto = require("crypto");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
    try {
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 400;
            throw error;
        }

        if (!first_name) {
            const error = new Error("First name cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        if (!last_name) {
            const error = new Error("Last name cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        if (!password) {
            const error = new Error("Password cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        if (password !== confirmPassword) {
            const error = new Error("Passwords mismatch!");
            error.statusCode = 400;
            throw error;
        }
        const user = await User.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            const error = new Error("User with email already exist!");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword,
        });
        sendWelcomeEmail(email, first_name, last_name);
        res.status(200).json({ message: "Account created successfully!" });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 400;
            throw error;
        }

        if (!password) {
            const error = new Error("Password cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            const error = new Error("Email not registered!");
            error.statusCode = 400;
            throw error;
        }
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, {
                expiresIn: 3600,
            });
            const dto = {
                token: token,
                data: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    id: user.id,
                },
            };
            res.status(200).json(dto);
        } else {
            const error = new Error("Password incorrect!");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error(errors.array()[0].msg);
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({
            where: {
                email: email,
            },
        });
        if (!user) {
            const error = new Error("Email not registered!");
            error.statusCode = 400;
            throw error;
        }
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                throw err;
            }
            const reset_token = buffer.toString("hex");
            const reset_token_expiry = Date.now() + 360000;
            user.set("reset_token", reset_token);
            user.set("reset_token_expiry", reset_token_expiry);
            await user.save();
            sendResetPasswordEmail(email, reset_token);
            res.status(200).json({ message: "Reset password link send to email!" });
        });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirm_password;
        const resetToken = req.body.reset_token;

        if (!password) {
            const error = new Error("Password cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        if (password !== confirmPassword) {
            const error = new Error("Passwords mismatch!");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({
            where: {
                reset_token: resetToken,
                reset_token_expiry: {
                    [Op.gt]: Date.now(),
                },
            },
        });
        if (!user) {
            const error = new Error("Invalid or expired token!");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        user.set("reset_token", null);
        user.set("reset_token_expiry", null);
        user.set("password", hashedPassword);
        await user.save();
        res.status(200).json({ message: "Password reset successfully!" });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.getUserData = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            const error = new Error("Token missing!");
            error.statusCode = 400;
            throw error;
        }
        const token = req.headers.authorization.split(" ")[1];
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            const error = new Error("Unidentified user!");
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findOne({
            attributes: ["first_name", "last_name", "email"],
            where: {
                id: decodedToken.id,
            },
        });
        if (!user) {
            const error = new Error("Unidentified user!");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};
