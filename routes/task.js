const express = require("express");
const taskController = require("../controllers/task");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use(async (req, res, next) => {
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
        req.userId = decodedToken.id;
        next();
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).send({ message: err.message });
    }
});

router.post("/create", taskController.createTask);

router.get("/:taskId", taskController.getTask);

router.put("/:taskId", taskController.editTask);

router.delete("/:taskId", taskController.deleteTask);

router.get("/", taskController.getAllTasks);

module.exports = router;
