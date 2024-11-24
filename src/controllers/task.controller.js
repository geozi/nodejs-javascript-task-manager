const Task = require("../models/task.model");
const {
  taskCreationRules,
  taskUpdateRules,
  taskDeletionRules,
} = require("../middleware/validation");
const responseMsgs = require("../config/responseMsgs");
const validator = require("express-validator");

/**
 * Handles new task persistence.
 *
 * When the create method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of task creation requests. If the validation passes, it
 * proceeds to the main logic of the method which handles new task persistence.
 */
const create = [
  ...taskCreationRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { title, description, status, username } = req.body;
      const newTask = new Task({
        title: title,
        description: description,
        status: status,
        username: username,
      });

      await newTask.save();

      return res.status(201).json({ message: responseMsgs.TASK_CREATED });
    } catch (err) {
      if (err.name === "ValidationError") {
        const mongooseErrors = Object.values(err.errors).map((e) => ({
          msg: e.message,
        }));
        return res.status(400).json({ errors: mongooseErrors });
      }
      res.status(500).json({ message: responseMsgs.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Handles task update.
 *
 * When the update method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of task update requests. If the validation passes, it
 * proceeds to the main logic of the method which handles task updates.
 */
const update = [
  ...taskUpdateRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));
      //console.log("Validation Errors:", errorMsg);
      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id, title, description, status, username } = req.body;

      const taskToUpdate = {
        title: title,
        description: description,
        status: status,
        username: username,
      };

      const updatedTask = await Task.findByIdAndUpdate(id, taskToUpdate, {
        new: true,
        runValidators: true,
        context: "query",
      });

      if (!updatedTask) {
        return res.status(404).json({ message: responseMsgs.TASK_NOT_FOUND });
      }

      return res.status(200).json({ message: responseMsgs.TASK_UPDATED });
    } catch (err) {
      console.log(`Error: ${err}`);
      res.status(500).json({ message: responseMsgs.INTERNAL_SERVER_ERROR });
    }
  },
];

/**
 * Handles task removal.
 *
 * When the deleteTask method is called, it first executes the
 * ValidationChain path, running all middleware functions responsible
 * for the validation of task removal requests. If the validation passes, it
 * proceeds to the main logic of the method which handles task removals.
 */
const deleteTask = [
  ...taskDeletionRules(),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => ({
        msg: err.msg,
      }));

      return res.status(400).json({ errors: errorMsg });
    }

    try {
      const { id } = req.body;
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ message: responseMsgs.TASK_NOT_FOUND });
      }
      return res.status(204).json({ message: responseMsgs.TASK_DELETED });
    } catch (err) {
      res.status(500).json({ message: responseMsgs.INTERNAL_SERVER_ERROR });
    }
  },
];

module.exports = { create, update, deleteTask };
