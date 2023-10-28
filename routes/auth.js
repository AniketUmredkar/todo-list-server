const express = require("express");
const User = require("../models/user");
const sequelize = require("../utils/database");

const router = express.Router();

router.post("/sign-in", (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    User.create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password,
    })
        .then(() => {
            res.status(200).send({ message: "successfull" });
        })
        .catch((err) => {
            console.log(err);
            res.send(400).send({ message: "error" });
        });
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findAll({
        attributes: ['first_name', 'last_name'],
        where: {
            email: email,
            password: password,
        },
    })
        .then((user) => {
            res.status(200).send(user[0]);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "error" });
        });
});

router.post("/forgot-password", (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
});

router.post("/reset-password", (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
});

module.exports = router;
