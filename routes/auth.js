const express = require("express");
const { createUser } = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.post("/sign-in", (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password, req.first_name, req.last_name);
    user.save();
    res.status(200).send({ message: "successfull" });
});

router.post("/login", (req, res) => {

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
