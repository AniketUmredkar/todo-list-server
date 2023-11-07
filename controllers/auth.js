const User = require("../models/user");

exports.signUp = (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where: {
            email: email,
        },
    })
        .then((user) => {
            if (user) {
                return res.status(400).send({ message: "User with email already exist" });
            }
            User.create({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
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
            req.session.user_id = user.id;
            res.status(200).send(user);
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
