const User = require("../models/user");

exports.signInController = (req, res) => {
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

exports.loginController = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findAll({
        attributes: ["first_name", "last_name"],
        where: {
            email: email,
            password: password,
        },
    })
        .then((user) => {
            if(user.length == 0){
                res.status(401).send({message: "unable to login"});
            }
            res.status(200).send(user[0]);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "error" });
        });
};

exports.forgotPasswordController = (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
};

exports.resetPasswordController = (req, res) => {
    console.log(req.body);
    res.status(200).send({ message: "successfull" });
};
