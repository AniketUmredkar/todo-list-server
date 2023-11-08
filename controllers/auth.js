const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail, sendResetPasswordEmail } = require("../utils/aws");
const crypto = require("crypto");
const { Op } = require("sequelize");

exports.signUp = (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (user) {
                return res.status(400).send({ message: "User with email already exist" });
            }
            if (password !== confirmPassword) {
                return res.status(400).send({ message: "Passwords mismatch" });
            }
            bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    User.create({
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: hashedPassword,
                    })
                        .then((user) => {
                            sendWelcomeEmail(email, first_name, last_name);
                            req.session.user_id = user.id;
                            return res.status(200).send({ message: "successfull" });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.send(400).send({ message: "error" });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    return res.send(400).send({ message: "error" });
                });
        })
        .catch((err) => {
            console.log(err);
            return res.send(400).send({ message: "error" });
        });
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(401).send({ message: "Email not registered" });
            }
            bcrypt
                .compare(password, user.password)
                .then((result) => {
                    if (result) {
                        req.session.user_id = user.id;
                        const userDto = {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            id: user.id,
                        };
                        res.status(200).send(userDto);
                    } else {
                        return res.status(401).send({ message: "Password incorrect" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({ message: "error" });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "error" });
        });
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.status(200).send({ message: "successfull" });
};

exports.forgotPassword = (req, res) => {
    const email = req.body.email;
    console.log(email);
    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(400).send({ message: "Email not registered" });
            }
            crypto.randomBytes(32, (err, buffer) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send({ message: "error" });
                }
                const reset_token = buffer.toString("hex");
                const reset_token_expiry = Date.now() + 360000;
                user.set("reset_token", reset_token);
                user.set("reset_token_expiry", reset_token_expiry);
                user.save()
                    .then((user) => {
                        sendResetPasswordEmail(email, reset_token);
                        return res.status(200).send({ message: "Reset password link send to email" });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(400).send({ message: "error" });
                    });
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "error" });
        });
};

exports.resetPassword = (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    const resetToken = req.body.reset_token;
    if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords mismatch" });
    }
    User.findOne({
        where: {
            reset_token: resetToken,
            reset_token_expiry: {
                [Op.gt]: Date.now(),
            },
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(400).send({ message: "Invalid or expired token" });
            }
            bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    user.set("reset_token", null);
                    user.set("reset_token_expiry", null);
                    user.set("password", hashedPassword);
                    user.save()
                        .then((user) => {
                            if (!user) {
                                return res.status(400).send({ message: "error" });
                            }
                            res.status(200).send({ message: "Password reset successfully" });
                        })
                        .catch((err) => {
                            console.log(err);
                            return res.status(400).send({ message: "error" });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(400).send({ message: "error" });
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).send({ message: "error" });
        });
};
