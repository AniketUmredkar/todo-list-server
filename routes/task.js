const express = require("express");
const taskController = require("../controllers/task");
const { parseCookies } = require("../utils/helpers");
const User = require("../models/user");
const multer = require("multer");
const upload = multer();

const router = express.Router();

router.use((req, res, next) => {
    const parsedCookies = parseCookies(req.headers.cookie);
    User.findOne({
        where: {
            id: parsedCookies.user_id,
        },
    })
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            console.log(err);
            res.status(403).send({ message: "Unidentified user!" });
        });
});

router.post("/create", upload.none(), taskController.createTask);

router.get("/:taskId", taskController.getTask);

router.put("/:taskId", upload.none(), taskController.editTask);

router.delete("/:taskId", taskController.deleteTask);

router.get("/", taskController.getAllTasks);

module.exports = router;
