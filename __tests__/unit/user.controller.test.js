const bcrypt = require("bcryptjs");
const User = require("../../src/models/user.model");
const { create } = require("../../src/controllers/user.controller");
const responseMsgs = require("../../src/config/responseMsgs");
const validationErrorMsgs = require("../../src/config/validationErrorMsgs");

jest.mock("bcryptjs");
jest.mock("../../src/models/user.model");

describe.skip("User controller unit tests", () => {
  describe("Testing user controller - create", () => {
    describe("HTTP status code: 201", () => {
      let req, res, next;

      beforeEach(() => {
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
        User.prototype.save = jest.fn().mockResolvedValue({});
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      test("#1 Successful creation: all fields", async () => {
        req = {
          body: {
            username: "newUser",
            email: "mymail@example.com",
            password: "lj}6L6H$=0(UgI&",
          },
        };

        bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

        for (let middleware of create) {
          await middleware(req, res, next);
        }

        expect(bcrypt.hash).toHaveBeenCalledWith("lj}6L6H$=0(UgI&", 10);
        expect(User.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
          message: responseMsgs.USER_REGISTERED,
        });
      });
    });

    describe("HTTP status code: 400", () => {
      describe("#1 Bad request: username field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          User.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        test("#1.1 Bad request: undefined username", async () => {
          req = {
            body: {
              email: "random@mail.com",
              password: "AB,_La(2M-IoxAX",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.USERNAME_REQUIRED },
              { msg: validationErrorMsgs.USERNAME_MIN_LENGTH },
            ],
          });
        });

        test("#1.2 Bad request: null username", async () => {
          req = {
            body: {
              username: null,
              email: "aMail@example.com",
              password: "p-c(UC-P9v-Hp0~",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.USERNAME_REQUIRED },
              { msg: validationErrorMsgs.USERNAME_MIN_LENGTH },
            ],
          });
        });

        test("#1.3 Bad request: username too short", async () => {
          req = {
            body: {
              username: "ab",
              email: "random@mail.com",
              password: "bwZ_Pc)^.5h7@%8",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.USERNAME_MIN_LENGTH }],
          });
        });

        test("#1.4 Bad request: username too long", async () => {
          req = {
            body: {
              username: "thisIsAVeryLongUsername",
              email: "myemail@example.com",
              password: "@i66zQ=h)2FLKBh",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.USERNAME_MAX_LENGTH }],
          });
        });
      });

      describe("#2 Bad request: email field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          User.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        test("#2.1 Bad request: undefined email", async () => {
          req = {
            body: {
              username: "newUser",
              password: ")Xiz^fr!h3S[1oR",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.EMAIL_REQUIRED },
              { msg: validationErrorMsgs.EMAIL_INVALID },
            ],
          });
        });

        test("#2.2 Bad request: null email", async () => {
          req = {
            body: {
              username: "u123",
              email: null,
              password: "dsv%UT(w&GYL9%o",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.EMAIL_REQUIRED },
              { msg: validationErrorMsgs.EMAIL_INVALID },
            ],
          });
        });

        test("#2.3 Bad request: no email prefix", async () => {
          req = {
            body: {
              username: "u15",
              email: "@mail.com",
              password: "L6!t6zIp9m'oZiS",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.EMAIL_INVALID }],
          });
        });

        test("#2.4 Bad request: no @", async () => {
          req = {
            body: {
              username: "newUser",
              email: "randommail.com",
              password: "ck12ltBMbCCCvYwCQ*",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.EMAIL_INVALID }],
          });
        });

        test("#2.5 Bad request: no email domain name", async () => {
          req = {
            body: {
              username: "nu1",
              email: "random@.com",
              password: "edVs$$)%&3;yW[6",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.EMAIL_INVALID }],
          });
        });

        test("#2.6 Bad request: no .", async () => {
          req = {
            body: {
              username: "user1234",
              email: "random@mailcom",
              password: "Cv})9{ZjIxmlktu",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.EMAIL_INVALID }],
          });
        });

        test("#2.7 Bad request: no top level domain", async () => {
          req = {
            body: {
              username: "randomUser1",
              email: "random@mail.",
              password: "),4%^M]&QpHmoH,",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.EMAIL_INVALID }],
          });
        });
      });

      describe("#3 Bad request: password field", () => {
        let req, res, next;

        beforeEach(() => {
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
          };
          next = jest.fn();
          User.prototype.save = jest.fn().mockResolvedValue({});
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        test("#3.1 Bad request: undefined password", async () => {
          req = {
            body: {
              username: "randomUser",
              email: "myEmail@example.gr",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_REQUIRED },
              { msg: validationErrorMsgs.PASSWORD_MIN_LENGTH },
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.2 Bad request: null password", async () => {
          req = {
            body: {
              username: "user1",
              email: "mymail@example.gr",
              password: null,
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_REQUIRED },
              { msg: validationErrorMsgs.PASSWORD_MIN_LENGTH },
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.3 Bad request: no lowercase characters", async () => {
          req = {
            body: {
              username: "user24",
              email: "me@random.gr",
              password: "0C+W#8S[AB@HR-,",
            },
          };
          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.4 Bad request: no uppercase characters", async () => {
          req = {
            body: {
              username: "user24",
              email: "new@email.com",
              password: "&itb8_m}p$=xnx5",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.5 Bad request: no numbers", async () => {
          req = {
            body: {
              username: "newUser",
              email: "hello@email.com",
              password: "FIDeZbt)WR-r(S&",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.6 Bad request: no special characters", async () => {
          req = {
            body: {
              username: "u1234",
              email: "myEmail@example.com",
              password: "8XXV4FrMdqt6r2g",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [
              { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
            ],
          });
        });

        test("#3.7 Bad request: password too short", async () => {
          req = {
            body: {
              username: "userNew",
              email: "adress@domain.gr",
              password: "}~%8bH",
            },
          };

          for (let middleware of create) {
            await middleware(req, res, next);
          }

          expect(User.prototype.save).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
            errors: [{ msg: validationErrorMsgs.PASSWORD_MIN_LENGTH }],
          });
        });
      });
    });
  });
});
