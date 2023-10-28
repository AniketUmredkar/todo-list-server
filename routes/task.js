const express = require("express");
const {
    getTaskController,
    createTaskController,
    getAllTasksController,
    editTaskController,
    deleteTaskController,
} = require("../controllers/task");

const router = express.Router();

router.post("/create", createTaskController);

router.get("/:taskId", getTaskController);

router.put("/:taskId", editTaskController);

router.delete("/:taskId", deleteTaskController);

router.get("/", getAllTasksController);

module.exports = router;
