require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../../src/models/user.model");
const { create } = require("../../src/controllers/user.controller");
const { login } = require("../../src/auth/authController");
const authMsgs = require("../../src/config/authMsgs");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe.skip("User processing integration tests", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  test("User creation", async () => {
    const req = {
      body: {
        username: "newUser",
        email: "rmail@random.com",
        password: "Dg2&ysPrc3Lol4o",
      },
    };

    for (let middleware of create) {
      await middleware(req, res, next);
    }

    const user = await User.findOne({ username: req.body.username });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(user).not.toBeNull();
    expect(user.username).toBe("newUser");
  });

  describe("User login", () => {
    describe("Successful login", () => {
      test("#1 Matching fields", async () => {
        const createReq = {
          body: {
            username: "u123",
            email: "myEmail@example.com",
            password: "H+Rv&v_~yk2;l9y",
          },
        };

        for (let middleware of create) {
          await middleware(createReq, res, next);
        }

        const loginReq = {
          body: {
            username: "u123",
            password: "H+Rv&v_~yk2;l9y",
          },
        };

        for (let middleware of login) {
          await middleware(loginReq, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });

    describe("Unsuccessful login", () => {
      describe("Wrong fields", () => {
        test("Add dummy data", async () => {
          const createReq = {
            body: {
              username: "myUser",
              email: "myMail@random.gr",
              password: "NTu=5~^vco^NgYJ",
            },
          };

          for (let middleware of create) {
            await middleware(createReq, res, next);
          }
        });

        const loginFailedCases = [
          [
            "#1 Unsuccessful login: wrong username",
            {
              username: "nUser1",
              password: "NTu=5~^vco^NgYJ",
            },
          ],
          [
            "#2 Unsuccessful login: wrong password",
            {
              username: "myUser",
              password: "4x;CtRV;BhLS80J",
            },
          ],
        ];

        loginFailedCases.forEach(([testName, input]) => {
          test(testName, async () => {
            req = { body: input };

            for (let middleware of login) {
              await middleware(req, res, next);
            }

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
              message: authMsgs.AUTH_FAILED,
            });
          });
        });
      });
    });
  });
});
