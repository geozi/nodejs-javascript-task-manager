const Task = require("../../src/models/task.model");
const {
  create,
  update,
  deleteTask,
} = require("../../src/controllers/task.controller");
const responseMsgs = require("../../src/config/responseMsgs");
const validationErrorMsgs = require("../../src/config/validationErrorMsgs");

jest.mock("../../src/models/task.model");

describe.skip("Task controller unit tests", () => {
  describe("Testing task controller - create", () => {
    describe("HTTP status code: 201", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        Task.prototype.save = jest.fn().mockResolvedValue({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      const testCases = [
        [
          "#1 Successful creation: all fields",
          {
            title: "Add paragraph to text",
            description:
              "Admiration stimulated cultivated reasonable be projection possession of. Real no near room ye bred sake if some. Is arranging furnished knowledge agreeable so. Fanny as smile up small. It vulgar chatty simple months turned oh at change of. Astonished set expression solicitude way admiration.",
            status: "pending",
            username: "randomUser",
          },
        ],
        [
          "#2 Successful creation: undefined description",
          {
            title: "Add documentation to code",
            status: "pending",
            username: "firstUser",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(Task.prototype.save).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(201);
          expect(res.json).toHaveBeenCalledWith({
            message: responseMsgs.TASK_CREATED,
          });
        });
      });
    });

    describe("HTTP status code: 400", () => {
      describe("#1 Bad request: title field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          Task.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        const testCases = [
          [
            "#1.1 Bad request: undefined title",
            {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
              status: "pending",
              username: "user12",
            },
          ],
          [
            "#1.2 Bad request: null title",
            {
              title: null,
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
              status: "pending",
              username: "u123",
            },
          ],
        ];

        testCases.forEach(([testName, input]) => {
          test(testName, async () => {
            req = { body: input };

            for (let middleware of create) {
              await middleware(req, res, next);
            }

            expect(Task.prototype.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
              errors: [{ msg: validationErrorMsgs.TITLE_REQUIRED }],
            });
          });
        });

        test("#1.3 Bad request: title too long", async () => {
          req = {
            body: {
              title:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
              status: "pending",
              username: "newUser",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(Task.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.TITLE_MAX_LENGTH }],
          });
        });
      });

      describe("#2 Bad request: description field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          Task.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        test("#2.1 Bad request: description too long", async () => {
          req = {
            body: {
              title: "Add comment to the landing page",
              description:
                "The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation and their most common words. Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators.",
              status: "pending",
              username: "newUser",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(Task.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.DESCRIPTION_MAX_LENGTH }],
          });
        });
      });

      describe("#3 Bad request: status field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          Task.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        const testCases = [
          [
            "#3.1 Bad request: undefined status",
            {
              title: "Readjust page height",
              description: "",
              username: "random12",
            },
          ],
          [
            "#3.2 Bad request: null status",
            {
              title: "Optimize css file",
              description: "",
              status: null,
              username: "newuser",
            },
          ],
        ];

        testCases.forEach(([testName, input]) => {
          test(testName, async () => {
            req = { body: input };

            for (let middleware of create) {
              await middleware(req, res, next);
            }

            expect(Task.prototype.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
              errors: [
                { msg: validationErrorMsgs.STATUS_REQUIRED },
                { msg: validationErrorMsgs.STATUS_INVALID },
              ],
            });
          });
        });

        test("#3.3 Bad request: invalid status", async () => {
          req = {
            body: {
              title: "Improve unit testing",
              description: "",
              status: "incomplete",
              username: "heyUser",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(Task.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.STATUS_INVALID }],
          });
        });
      });

      describe("#4 Bad request: username field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          Task.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        const testCases = [
          [
            "#4.1 Bad request: undefined username",
            {
              title: "Change font in css file",
              description: "",
              status: "pending",
            },
          ],
          [
            "#4.2 Bad request: null username",
            {
              title: "Re-write documentation",
              description: "",
              status: "pending",
              username: null,
            },
          ],
        ];

        testCases.forEach(([testName, input]) => {
          test(testName, async () => {
            req = { body: input };

            for (let middleware of create) {
              await middleware(req, res, next);
            }

            expect(Task.prototype.save).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
              errors: [{ msg: validationErrorMsgs.USERNAME_REQUIRED }],
            });
          });
        });
      });
    });
  });

  describe("Testing task controller - update", () => {
    describe("HTTP status code: 200", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        Task.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      const testCases = [
        [
          "#1 Successful update: all fields",
          {
            id: "673f54d0bb38ee84fa0738ac",
            title: "Adjust character width",
            description: "Adjust character width in the html form",
            status: "complete",
            username: "user45",
          },
        ],
        [
          "#2 Successful update: undefined title",
          {
            id: "673f60c7de2d7a2bb5ea75d2",
            description:
              "Use multimeter devices to physically test that the current goes through the system",
            status: "complete",
            username: "random123",
          },
        ],
        [
          "#3 Successful update: undefined description",
          {
            id: "673f604ad2cdb34c980dcabe",
            title: "Add parameters to function",
            status: "complete",
            username: "user123",
          },
        ],
        [
          "#4 Successful update: undefined status",
          {
            id: "673f642dbb6f685be145a990",
            title: "This is another task that needs to be done",
            description: "",
            username: "seasonedUser",
          },
        ],
        [
          "#5 Successful update: undefined username",
          {
            id: "673f647a92b1354867718a2f",
            title: "Add more documentation to the codebase",
            description: "",
            status: "pending",
          },
        ],
        [
          "#6 Successful update: only id",
          {
            id: "673f6987cf48da5d91e8553c",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of update) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: responseMsgs.TASK_UPDATED,
          });
        });
      });
    });

    describe("HTTP status code: 404", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        Task.findByIdAndUpdate = jest.fn().mockResolvedValue(undefined);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      const testCases = [
        [
          "#1 Not found: all fields",
          {
            id: "673f6a2c43548423a0ac9f7d",
            title: "Extend integration tests",
            description: "",
            status: "pending",
            username: "randomUser10",
          },
        ],
        [
          "#2 Not found: undefined title",
          {
            id: "673f6be59f337fc9df3af01f",
            description: "",
            status: "complete",
            username: "proUser",
          },
        ],
        [
          "#3 Not found: null title",
          {
            id: "673f6c9f59443e44bbcbc1a4",
            title: null,
            description: "",
            status: "pending",
            username: "user12",
          },
        ],
        [
          "#4 Not found: undefined description",
          {
            id: "673f6c3504dd1326451ba5bb",
            title: "Refactor existing codebase",
            status: "pending",
            username: "user123",
          },
        ],
        [
          "#5 Not found: null description",
          {
            id: "673f6f7d34ea7a3eba2dd55e",
            title: "Add'hello world' into landing page",
            description: null,
            status: "complete",
            username: "nUser1",
          },
        ],
        [
          "#6 Not found: undefined status",
          {
            id: "673f6fe67e16d413df573267",
            title: "Refactor unit tests",
            description: "",
            username: "nUser2",
          },
        ],
        [
          "#7 Not found: only id",
          {
            id: "673f6af23dd8e77cfdb1d45b",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of update) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({
            message: responseMsgs.TASK_NOT_FOUND,
          });
        });
      });
    });

    describe("HTTP status code: 400", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        Task.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      let testCases = [
        [
          "#1 Bad request: undefined id",
          {
            title: "Refactor data collection processes",
            description: "",
            status: "pending",
            username: "newUser",
          },
        ],
        [
          "#2 Bad request: null id",
          {
            id: null,
            title: "Copy 'Hello World' message",
            description: "",
            status: "pending",
            username: "newUser",
          },
        ],
        [
          "#3 Bad request: empty id",
          {
            id: "",
            title: "Update data migration processes",
            description: "",
            username: "myUser",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of update) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.ID_REQUIRED },
              { msg: validationErrorMsgs.ID_INVALID },
              { msg: validationErrorMsgs.ID_LENGTH },
            ],
          });
        });
      });

      test("#4 Bad request: invalid id", async () => {
        req = {
          body: {
            id: "674&*ad47570e8d1--26f61c",
            title: "Update data sharing policy",
            description:
              "The documentation on data sharing policy needs an update",
            status: "complete",
            username: "nUser1",
          },
        };

        for (let middleware of update) {
          await middleware(req, res, next);
        }

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.ID_INVALID }],
        });
      });

      testCases = [
        [
          "#5 Bad request: too short id",
          {
            id: "67403ad47570e8d1222",
            title: "Improve regex performance",
            description: "",
            status: "complete",
            username: "proUser",
          },
        ],

        [
          "#6 Bad request: too long id",
          {
            id: "674043db7da0b5b3bdbc023612a",
            title: "Refactor Javascript modules",
            description: "",
            status: "pending",
            username: "nUser",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of update) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.ID_LENGTH }],
          });
        });
      });

      test("#7 Bad request: too long title", async () => {
        req = {
          body: {
            id: "67404994ea96fbe6a815ea6a",
            title:
              "Add your favorite books that have titles that have at least six words, not counting what comes after the colon",
            description: "",
            status: "pending",
            username: "helloUser",
          },
        };

        for (let middleware of update) {
          await middleware(req, res, next);
        }

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.TITLE_MAX_LENGTH }],
        });
      });

      test("#8 Bad request: too long description", async () => {
        req = {
          body: {
            id: "674049f0f6cde66c1e388399",
            title: "Add description",
            description:
              "The European languages are members of the same family. Their separate existence is a myth. For science, music, sport, etc, Europe uses the same vocabulary. The languages only differ in their grammar, their pronunciation and their most common words. Everyone realizes why a new common language would be desirable: one could refuse to pay expensive translators.",
          },
          status: "pending",
          username: "randomUser",
        };

        for (let middleware of update) {
          await middleware(req, res, next);
        }

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.DESCRIPTION_MAX_LENGTH }],
        });
      });

      test("#9 Bad request: invalid status", async () => {
        req = {
          body: {
            id: "67404b10f71a754146fcb8b5",
            title: "Hello word",
            description: "",
            status: "incomplete",
            username: "user1",
          },
        };

        for (let middleware of update) {
          await middleware(req, res, next);
        }

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.STATUS_INVALID }],
        });
      });
    });

    describe("HTTP status code: 204", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        Task.findByIdAndUpdate = jest.fn().mockResolvedValue({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      let testCases = [
        ["#1 No content: undefined id", {}],
        [
          "#2 No content: null id",
          {
            id: null,
          },
        ],
        [
          "#3 No content: empty id",
          {
            id: "",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of deleteTask) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.ID_REQUIRED },
              { msg: validationErrorMsgs.ID_INVALID },
              { msg: validationErrorMsgs.ID_LENGTH },
            ],
          });
        });
      });

      test("#4 No content: invalid id", async () => {
        req = {
          body: {
            id: "674&*ad47570e8d1--26f61c",
          },
        };

        for (let middleware of deleteTask) {
          await middleware(req, res, next);
        }

        expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.ID_INVALID }],
        });
      });

      testCases = [
        [
          "#5 No content: too short id",
          {
            id: "67403ad47570e8d1222",
          },
        ],

        [
          "#6 No content: too long id",
          {
            id: "674043db7da0b5b3bdbc023612a",
          },
        ],
      ];

      testCases.forEach(([testName, input]) => {
        test(testName, async () => {
          req = { body: input };

          for (let middleware of deleteTask) {
            await middleware(req, res, next);
          }

          expect(Task.findByIdAndUpdate).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.ID_LENGTH }],
          });
        });
      });
    });
  });
});
