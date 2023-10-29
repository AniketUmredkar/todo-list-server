const User = require("../models/user");

exports.signUp = (req, res) => {
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
};

exports.login = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        attributes: ["first_name", "last_name", "id"],
        where: {
            email: email,
            password: password,
        },
    })
        .then((user) => {
            if (!user) {
                return res.status(401).send({ message: "unable to login" });
            }
            res.cookie("user_id", user.id, { maxAge: 500000000, httpOnly: true });
            res.status(200).send(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "error" });
        });
};

exports.loguut = (req, res) => {
    console.log(req.body);
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
