/**
 * Performing unit tests on the Task model
 */

const Task = require("../../src/models/task.model");
const validationErrorMsgs = require("../../src/config/validationErrorMsgs");

// Calling mongoose to avert any test leakages.
const mockingoose = require("mockingoose");
beforeAll(() => {
  mockingoose.resetAll();
});

describe.skip("Task model unit tests", () => {
  describe("Testing required field absences", () => {
    test("#1 No parameters", () => {
      const task = new Task({});
      const err = task.validateSync();

      expect(task.title).toBeUndefined();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.title.message).toBe(validationErrorMsgs.TITLE_REQUIRED);

      expect(task.status).toBeUndefined();
      expect(err.errors.status).toBeDefined();
      expect(err.errors.status.message).toBe(
        validationErrorMsgs.STATUS_REQUIRED
      );

      expect(task.username).toBeUndefined();
      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMsgs.USERNAME_REQUIRED
      );
    });
  });

  describe("Testing the title field", () => {
    const titleRequiredCases = [
      [
        "#1 No title: undefined",
        new Task({
          status: "pending",
          username: "user1",
        }),
      ],
      [
        "#2 No title: null",
        new Task({
          title: null,
          status: "pending",
          username: "user1",
        }),
      ],
    ];

    titleRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const task = input;
        const err = task.validateSync();
        expect(err.errors.title).toBeDefined();
        expect(err.errors.title.message).toBe(
          validationErrorMsgs.TITLE_REQUIRED
        );
      });
    });

    test("#3 Invalid title: too long", () => {
      const task = new Task({
        title:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        status: "pending",
        username: "user23",
      });

      const err = task.validateSync();
      expect(err.errors.title).toBeDefined();
      expect(err.errors.title.message).toBe(
        validationErrorMsgs.TITLE_MAX_LENGTH
      );
    });
  });

  describe("Testing description field", () => {
    // Description test #1
    test("#1 No description: undefined", () => {
      const task = new Task({
        title: "Refactoring production code",
        status: "pending",
        username: "user123",
      });

      expect(task.description).toBeUndefined();
    });

    // Description test #2
    test("#2 No description: null", () => {
      const task = new Task({
        title: "Refactor unit tests on Task model",
        description: null,
        status: "pending",
        username: "newUser",
      });

      expect(task.description).toBeNull();
    });

    // Description test #3
    test("#3 Invalid description: too long", () => {
      const task = new Task({
        title: "Add docstrings",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        status: "pending",
        username: "u123",
      });

      const err = task.validateSync();
      expect(err.errors.description).toBeDefined();
      expect(err.errors.description.message).toBe(
        validationErrorMsgs.DESCRIPTION_MAX_LENGTH
      );
    });
  });

  describe("Testing status field", () => {
    const statusRequiredCases = [
      [
        "#1 No status: undefined",
        new Task({
          title: "Correct code syntax",
          username: "randomUser",
        }),
      ],
      [
        "#2 No status: null",
        new Task({
          title: "Optimize codebase",
          status: null,
          username: "aUser",
        }),
      ],
    ];

    statusRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const task = input;
        const err = task.validateSync();
        expect(err.errors.status).toBeDefined();
        expect(err.errors.status.message).toBe(
          validationErrorMsgs.STATUS_REQUIRED
        );
      });
    });

    // Status test #3
    test("#3 Invalid status: incomplete", () => {
      const task = new Task({
        title: "Review yesterday's commits",
        status: "incomplete",
        username: "myUser",
      });

      const err = task.validateSync();
      expect(err.errors.status).toBeDefined();
      expect(err.errors.status.message).toBe(
        validationErrorMsgs.STATUS_INVALID
      );
    });
  });

  describe("Testing username field", () => {
    const usernameRequiredCases = [
      [
        "#1 No username: undefined",
        new Task({
          title: "Notify team on recent changes",
          status: "pending",
        }),
      ],
      [
        "#2 No username: null",
        new Task({
          title: "Run production code",
          status: "complete",
          username: null,
        }),
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const task = input;
        const err = task.validateSync();
        expect(err.errors.username).toBeDefined();
        expect(err.errors.username.message).toBe(
          validationErrorMsgs.USERNAME_REQUIRED
        );
      });
    });
  });
});
