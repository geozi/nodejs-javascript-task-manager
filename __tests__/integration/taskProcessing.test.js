require("dotenv").config();

const mongoose = require("mongoose");
const Task = require("../../src/models/task.model");
const {
  create,
  update,
  deleteTask,
} = require("../../src/controllers/task.controller");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Task.deleteMany({});
});

describe.skip("Task processing integration tests", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  test("Task creation", async () => {
    const req = {
      body: {
        title: "This is a title",
        description: "This is a description",
        status: "pending",
        username: "newUser",
      },
    };

    for (let middleware of create) {
      await middleware(req, res, next);
    }

    const task = await Task.findOne({ title: req.body.title });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(task).not.toBeNull();
    expect(task.title).toBe("This is a title");
  });

  test("Task update", async () => {
    const createReq = {
      body: {
        title: "Update validation rules",
        description:
          "Validation rules must be updated to reflect new changes in requirements",
        status: "pending",
        username: "newUser",
      },
    };

    for (let middleware of create) {
      await middleware(createReq, res, next);
    }

    const insertedTask = await Task.findOne({
      title: "Update validation rules",
    });

    const updateReq = {
      body: {
        id: insertedTask._id,
        title: "Validation rules have been updated",
        description: "",
        status: "complete",
        username: "newUser",
      },
    };

    for (let middleware of update) {
      await middleware(updateReq, res, next);
    }

    const updatedTask = await Task.findOne({ _id: updateReq.body.id });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(updatedTask.title).toBe("Validation rules have been updated");
  });

  test("Task deletion", async () => {
    const createReq = {
      body: {
        title: "Perform functional testing",
        description: "Site links need to be tested for better performance",
        status: "pending",
        username: "myUser",
      },
    };

    for (let middleware of create) {
      await middleware(createReq, res, next);
    }

    const insertedTask = await Task.findOne({
      title: "Perform functional testing",
    });

    const deleteReq = {
      body: { _id: insertedTask._id },
    };

    for (let middleware of deleteTask) {
      await middleware(deleteReq, res, next);
    }

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
