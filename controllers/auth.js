const User = require("../models/user");

exports.createUser = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password, req.first_name, req.last_name);
    user.save();
    res.status(200).send({ message: "successfull" });
}

exports.authenticateUser = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    res.status(200).send({ message: "successfull" });
}

exports.User = (req, res) => {
    console.log(req.body);
    const user = new User(req.body.email, req.body.password);
    res.status(200).send({ message: "successfull" });
}

