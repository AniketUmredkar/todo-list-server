const { Op } = require("sequelize");
const Task = require("../models/task");

exports.createTask = (req, res) => {
    const title = req.body.title;
    const user = req.user;

    if (!title) {
        return res.status(400).send({ message: "Title cannot be empty!" });
    }

    Task.create({ title: title, user_id: user.id })
        .then((task) => {
            res.status(200).send({ message: "Task created successfully!", data: task });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.getTask = (req, res) => {
    const taskId = req.params.taskId;
    const user = req.user;

    Task.findOne({
        where: {
            id: taskId,
            user_id: user.id,
        },
        attributes: ["title", "status", "createdAt", "updatedAt"],
    })
        .then((task) => {
            if (!task) {
                res.status(400).send({ message: "No data available!" });
            } else {
                res.status(200).send({ data: task });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.getAllTasks = (req, res) => {
    const user = req.user;
    Task.findAll({
        where: {
            user_id: user.id,
            status: {
                [Op.ne]: "deleted",
            },
        },
        attributes: ["id", "title", "status", "createdAt", "updatedAt"],
    })
        .then((tasks) => {
            res.status(200).send({ data: tasks });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.editTask = (req, res) => {
    const taskId = req.params.taskId;
    const user = req.user;
    const title = req.body.title;
    const status = req.body.status;

    const updateObj = {};

    if (title == undefined && status == undefined) {
        return res.status(400).send({ message: "Incomplete request!" });
    }
    if (title != undefined) {
        if (!title) {
            return res.status(400).send({ message: "Title cannot be empty!" });
        }
        updateObj.title = title;
    }
    if (status != undefined) {
        if (status != "pending" && status != "completed" && status != "deleted") {
            return res.status(400).send({ message: "Invalid status!" });
        }
        updateObj.status = status;
    }

    Task.update(updateObj, {
        where: {
            id: taskId,
            user_id: user.id,
        },
    })
        .then((task) => {
            if (task[0] > 0) {
                Task.findOne({
                    where: {
                        id: taskId,
                        user_id: user.id,
                    },
                    attributes: ["title", "status", "createdAt", "updatedAt"],
                })
                    .then((task) => {
                        res.status(200).send({ data: task });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(400).send({ message: "Something went wrong. Please try again!" });
                    });
            } else {
                res.status(400).send({ message: "No such task exists!" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.deleteTask = (req, res) => {
    const taskId = req.params.taskId;
    const user = req.user;

    Task.update(
        { status: "deleted" },
        {
            where: {
                id: taskId,
                user_id: user.id,
            },
        }
    )
        .then((task) => {
            if (task[0] > 0) {
                res.status(200).send({ message: "Task deleted successfully!" });
            } else {
                res.status(400).send({ message: "No such task exists!" });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};
