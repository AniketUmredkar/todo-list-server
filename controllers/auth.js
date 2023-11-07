const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
    console.log(req.body);
    req.session.destroy();
    res.status(200).send({ message: "successfull" });
};

exports.forgotPassword = (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
};

exports.resetPassword = (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
};
