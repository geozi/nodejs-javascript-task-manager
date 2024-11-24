/**
 * Performing unit tests on the User model.
 */

const User = require("../../src/models/user.model");
const validationErrorMsgs = require("../../src/config/validationErrorMsgs");

// Calling mockingoose to avert any test leakages.
const mockingoose = require("mockingoose");
beforeAll(() => {
  mockingoose.resetAll();
});

describe.skip("User model unit tests", () => {
  describe("Testing all field absence:", () => {
    test("#1 No parameters", () => {
      const user = new User();

      const err = user.validateSync();

      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMsgs.USERNAME_REQUIRED
      );

      expect(err.errors.email).toBeDefined();
      expect(err.errors.email.message).toBe(validationErrorMsgs.EMAIL_REQUIRED);

      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toBe(
        validationErrorMsgs.PASSWORD_REQUIRED
      );
    });
  });

  // Username tests

  describe("Testing username field:", () => {
    const usernameRequiredCases = [
      [
        "#1 No username: undefined",
        new User({
          email: "myEmail@example.gr",
          password: "JE8jN9Y6YgcTRTj*",
        }),
      ],
      [
        "#2 No username: null",
        new User({
          username: null,
          email: "newemail@example.gr",
          password: "VlansVp[xJM+!)K",
        }),
      ],
    ];

    usernameRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const user = input;
        const err = user.validateSync();
        expect(err.errors.username).toBeDefined();
        expect(err.errors.username.message).toBe(
          validationErrorMsgs.USERNAME_REQUIRED
        );
      });
    });

    test("#3 Invalid username: too short", () => {
      const user = new User({
        username: "ab",
        email: "myEmail@example.gr",
        password: "ikELyocLW1GqbfN*",
      });

      const err = user.validateSync();
      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMsgs.USERNAME_MIN_LENGTH
      );
    });

    test("#4 Invalid username: too long", () => {
      const user = new User({
        username: "thisIsAVeryLongUsername",
        email: "random@example.gr",
        password: "AlZ5V7B*kHNofrwC",
      });

      const err = user.validateSync();
      expect(err.errors.username).toBeDefined();
      expect(err.errors.username.message).toBe(
        validationErrorMsgs.USERNAME_MAX_LENGTH
      );
    });
  });

  // Email tests

  describe("Testing email field:", () => {
    const emailRequiredCases = [
      [
        "#1 No email address: undefined",
        new User({
          username: "randomUser",
          password: "Z2xpnMMCkcWzkYr*",
        }),
      ],
      [
        "#2 No email address: null",
        new User({
          username: "user123",
          email: null,
          password: "yzB.5mCh4}#2mc4",
        }),
      ],
    ];

    emailRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const user = input;
        const err = user.validateSync();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.email.message).toBe(
          validationErrorMsgs.EMAIL_REQUIRED
        );
      });
    });

    const emailInvalidCases = [
      [
        "#3 Invalid email address: no prefix",
        new User({
          username: "u5",
          email: "@mail.com",
          passworkd: "L6!t6zIp9m'oZiS",
        }),
      ],
      [
        "#4 Invalid email address: no @",
        new User({
          username: "newUser",
          email: "randommail.com",
          password: "ck12ltBMbCCCvYwCQ*",
        }),
      ],
      [
        "#5 Invalid email address: no domain name",
        new User({
          username: "nu1",
          email: "random@.com",
          password: "edVs$$)%&3;yW[6",
        }),
      ],
      [
        "#6 Invalid email address: no .",
        new User({
          username: "user1234",
          email: "random@mailcom",
          password: "Cv})9{ZjIxmlktu",
        }),
      ],
      [
        "#7 Invalid email address: no top level domain",
        new User({
          username: "randomUser1",
          email: "random@mail.",
          password: "),4%^M]&QpHmoH,",
        }),
      ],
    ];

    emailInvalidCases.forEach(([testName, input]) => [
      test(testName, () => {
        const user = input;
        const err = user.validateSync();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.email.message).toBe(
          validationErrorMsgs.EMAIL_INVALID
        );
      }),
    ]);
  });

  // Password tests

  describe("Testing password field:", () => {
    const passwordRequiredCases = [
      [
        "#1 No password: undefined",
        new User({
          username: "randomUser",
          email: "myEmail@example.gr",
        }),
      ],
      [
        "#2 No password: null",
        new User({
          username: "user34",
          email: "aEmail@example.gr",
          password: null,
        }),
      ],
    ];

    passwordRequiredCases.forEach(([testName, input]) => {
      test(testName, () => {
        const user = input;
        const err = user.validateSync();
        expect(err.errors.password).toBeDefined();
        expect(err.errors.password.message).toBe(
          validationErrorMsgs.PASSWORD_REQUIRED
        );
      });
    });

    const passwordMustHaveCases = [
      [
        "#3 Invalid password: no lowercase characters",
        new User({
          username: "user24",
          email: "me@random.gr",
          password: "0C+W#8S[AB@HR-,",
        }),
      ],
      [
        "#4 Invalid password: no uppercase characters",
        new User({
          username: "user24",
          email: "new@email.com",
          password: "&itb8_m}p$=xnx5",
        }),
      ],
      [
        "#5 Invalid password: no numbers",
        new User({
          username: "newUser",
          email: "hello@email.com",
          password: "FIDeZbt)WR-r(S&",
        }),
      ],
      [
        "#6 Invalid password: no special symbols",
        new User({
          username: "u1234",
          email: "myEmail@example.com",
          password: "8XXV4FrMdqt6r2g",
        }),
      ],
    ];

    passwordMustHaveCases.forEach(([testName, input]) => {
      test(testName, () => {
        const user = input;
        const err = user.validateSync();
        expect(err.errors.password).toBeDefined();
        expect(err.errors.password.message).toBe(
          validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS
        );
      });
    });

    test("#7 Invalid password: too short", () => {
      const user = new User({
        username: "userNew",
        email: "adress@domain.gr",
        password: "}~%8bH",
      });

      const err = user.validateSync();
      expect(err.errors.password).toBeDefined();
      expect(err.errors.password.message).toBe(
        validationErrorMsgs.PASSWORD_MIN_LENGTH
      );
    });
  });
});
