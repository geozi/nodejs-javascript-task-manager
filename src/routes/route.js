const express = require("express");
const router = express.Router();
const { login, verifyToken } = require("../../src/auth/authController");
const userController = require("../../src/controllers/user.controller");
const taskController = require("../../src/controllers/task.controller");

router.post("/register", userController.create);
router.post("/login", login);
router.post("/tasks", verifyToken, taskController.create);
router.put("/tasks", verifyToken, taskController.update);
router.delete("/tasks", verifyToken, taskController.deleteTask);

module.exports = { router };
