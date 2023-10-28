const User = require("../models/user");

exports.createUser = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password, req.first_name, req.last_name);
    user.save()
        .then(() => {
            res.status(200).send({ message: "successfull" });
        })
        .catch((error) => {
            res.status(400).send({ message: error });
        });
};

exports.authenticateUser = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    res.status(200).send({ message: "successfull" });
};

exports.User = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    res.status(200).send({ message: "successfull" });
};
