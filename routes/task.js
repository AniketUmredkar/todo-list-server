const express = require("express");
const taskController = require("../controllers/task");

const router = express.Router();

router.post("/create", taskController.createTask);

router.get("/:taskId", taskController.getTask);

router.put("/:taskId", taskController.editTask);

router.delete("/:taskId", taskController.deleteTask);

router.get("/", taskController.getAllTasks);

module.exports = router;
