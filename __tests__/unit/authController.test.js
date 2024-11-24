const validationErrorMsgs = require("../../src/config/validationErrorMsgs");
const { login } = require("../../src/auth/authController");

describe("Testing auth controller", () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  describe.skip("HTTP status code: 400", () => {
    const usernameRequiredCases = [
      [
        "#1 Bad request: undefined username",
        {
          password: "D3]}@ts)7~{C7+r",
        },
      ],
      [
        "#2 Bad request: null username",
        {
          username: null,
          password: "u6Ufm_u(-}clSLy",
        },
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        let req = { body: input };

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { msg: validationErrorMsgs.USERNAME_REQUIRED },
            { msg: validationErrorMsgs.USERNAME_MIN_LENGTH },
          ],
        });
      });
    });

    test("#3 Bad request: too short username", async () => {
      let req = {
        body: {
          username: "me",
          password: "6g_15]O5VHE-}Vs",
        },
      };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMsgs.USERNAME_MIN_LENGTH }],
      });
    });

    test("#4 Bad request: too long username", async () => {
      let req = {
        body: {
          username: "ThisIsMyNewUsernameThatIThinkItMightBeTooLong",
          password: "6g_15]O5VHE-}Vs",
        },
      };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMsgs.USERNAME_MAX_LENGTH }],
      });
    });

    const passwordRequiredCases = [
      [
        "#5 Bad request: undefined password",
        {
          username: "randomUser",
        },
      ],
      [
        "#6 Bad request: null password",
        {
          username: "randomUser",
          password: null,
        },
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      test(testName, async () => {
        let req = { body: input };

        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [
            { msg: validationErrorMsgs.PASSWORD_REQUIRED },
            { msg: validationErrorMsgs.PASSWORD_MIN_LENGTH },
            { msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS },
          ],
        });
      });
    });

    test("#7 Bad request: too short password", async () => {
      let req = {
        body: {
          username: "user123",
          password: "c*V7JU",
        },
      };

      for (let middleware of login) {
        await middleware(req, res, next);
      }

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: validationErrorMsgs.PASSWORD_MIN_LENGTH }],
      });
    });

    const passwordMustHaveCases = [
      [
        "#8 Bad request: no lowercase characters",
        {
          username: "gUser",
          password: "VCV7%[EO;&-$+,Q",
        },
      ],
      [
        "#9 Bad request: no uppercase characters",
        {
          username: "newUser",
          password: "1j&'er8'}d7yuh=",
        },
      ],
      [
        "#10 Bad request: no numbers",
        {
          username: "helloUser",
          password: "&x]&'&eUAzL&&vt",
        },
      ],
      [
        "#11 Bad request: no special characters",
        {
          username: "gUser",
          password: "hkQIb1K25LdR8Ro",
        },
      ],
    ];

    passwordMustHaveCases.forEach(([testName, input]) => {
      test(testName, async () => {
        let req = { body: input };
        for (let middleware of login) {
          await middleware(req, res, next);
        }

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          errors: [{ msg: validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS }],
        });
      });
    });
  });
});
