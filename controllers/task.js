const { Op } = require("sequelize");
const Task = require("../models/task");

exports.createTask = async (req, res) => {
    try {
        const title = req.body.title;
        const userId = req.userId;

        if (!title) {
            const error = new Error("Title cannot be empty!");
            error.statusCode = 400;
            throw error;
        }

        const task = await Task.create({ title: title, user_id: userId });
        res.status(200).json({ message: "Task created successfully!", data: task });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.getTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;

        const task = await Task.findOne({
            where: {
                id: taskId,
                user_id: userId,
            },
            attributes: ["title", "status", "createdAt", "updatedAt"],
        });

        if (!task) {
            const error = new Error("No data available!");
            error.statusCode = 400;
            throw error;
        }

        res.status(200).json({ data: task });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const userId = req.userId;

        const tasks = await Task.findAll({
            where: {
                user_id: userId,
                status: {
                    [Op.ne]: "deleted",
                },
            },
            attributes: ["id", "title", "status", "createdAt", "updatedAt"],
        });
        res.status(200).json({ data: tasks });
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.editTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;
        const title = req.body.title;
        const status = req.body.status;

        const updateObj = {};

        if (title == undefined && status == undefined) {
            const error = new Error("Incomplete request!");
            error.statusCode = 400;
            throw error;
        }
        if (title != undefined) {
            if (!title) {
                const error = new Error("Title cannot be empty!");
                error.statusCode = 400;
                throw error;
            }
            updateObj.title = title;
        }
        if (status != undefined) {
            if (status != "pending" && status != "completed" && status != "deleted") {
                const error = new Error("Invalid status!");
                error.statusCode = 400;
                throw error;
            }
            updateObj.status = status;
        }

        const task = await Task.update(updateObj, {
            where: {
                id: taskId,
                user_id: userId,
            },
        });
        if (task[0] > 0) {
            const task = await Task.findOne({
                where: {
                    id: taskId,
                    user_id: userId,
                },
                attributes: ["title", "status", "createdAt", "updatedAt"],
            });
            res.status(200).json({ data: task });
        } else {
            const error = new Error("No such task exists!");
            error.statusCode = 400;
            throw error;
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.userId;

        const task = await Task.update(
            { status: "deleted" },
            {
                where: {
                    id: taskId,
                    user_id: userId,
                },
            }
        );
        if (task[0] > 0) {
            res.status(200).json({ message: "Task deleted successfully!" });
        } else {
            const error = new Error("No such task exists!");
            error.statusCode = 400;
            throw error;
        }
    } catch (err) {
        console.log(err);
        if (!err.statusCode) {
            return res.status(500).json({ message: "Unexpected error occured!" });
        }
        res.status(err.statusCode).json({ message: err.message });
    }
};
