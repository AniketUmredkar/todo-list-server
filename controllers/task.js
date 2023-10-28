const Task = require("../models/task");

const user_id = 1;

exports.createTaskController = (req, res) => {
    const title = req.body.title;
    if (!title) {
        res.status(400).send({ message: "Title cannot be empty!" });
    }
    Task.create({ title: title, user_id: user_id })
        .then((task) => {
            res.status(200).send({ message: "Task created successfully!", data: task });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.getTaskController = (req, res) => {
    const taskId = req.params.taskId;
    Task.findOne({
        where: {
            id: taskId,
            user_id: user_id,
        },
        attributes: ["title", "completed", "deleted", "createdAt", "updatedAt"],
    })
        .then((task) => {
            if (!task) {
                res.status(200).send({ message: "No data available!" });
            } else {
                res.status(200).send({ data: task });
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.getAllTasksController = (req, res) => {
    Task.findAll({
        where: {
            user_id: user_id,
            deleted: false,
        },
        attributes: ["title", "completed", "deleted", "createdAt", "updatedAt"],
    })
        .then((tasks) => {
            res.status(200).send({ data: tasks });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ message: "Something went wrong. Please try again!" });
        });
};

exports.editTaskController = (req, res) => {
    const taskId = req.params.taskId;
    const title = req.body.title;
    Task.update(
        { title: title },
        {
            where: {
                id: taskId,
                user_id: user_id,
            },
        }
    )
        .then((task) => {
            if (task[0] > 0) {
                Task.findOne({
                    where: {
                        id: taskId,
                        user_id: user_id,
                    },
                    attributes: ["title", "completed", "deleted", "createdAt", "updatedAt"],
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

exports.deleteTaskController = (req, res) => {
    const taskId = req.params.taskId;
    Task.update(
        { deleted: true },
        {
            where: {
                id: taskId,
                user_id: user_id,
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
