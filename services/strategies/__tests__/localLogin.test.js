import { localLogin } from "services/strategies/localLogin";
import { alreadyLoggedIn, badCredentials } from "shared/authErrors";

const next = jest.fn();

describe("Local Login Middleware", () => {
  let res;
  beforeEach(() => {
    res = mockResponse();
  });

  afterEach(() => {
    next.mockClear();
  });

  let db;
  beforeAll(() => {
    db = connectDatabase();
  });

  afterAll(async () => {
    await db.close();
  });

  it("handles empty body requests", async done => {
    const emptybody = {
      email: "",
      password: "",
    };

    const req = mockRequest(null, null, emptybody);

    await localLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: badCredentials });
    done();
  });

  it("handles invalid emails", async done => {
    const invalidEmail = {
      email: "invalidemail@example.com",
      password: "12345",
    };

    const req = mockRequest(null, null, invalidEmail);

    await localLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: badCredentials });
    done();
  });

  it("handles invalid passwords", async done => {
    const invalidPassword = {
      email: "member@example.com",
      password: "12345",
    };

    const req = mockRequest(null, null, invalidPassword);

    await localLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: badCredentials });
    done();
  });

  it("handles valid login requests", async done => {
    const validLogin = {
      email: "member@example.com",
      password: "password",
    };

    const req = mockRequest(null, {}, validLogin);

    await localLogin(req, res, next);

    expect(req.session.user).toEqual(
      expect.objectContaining({
        id: expect.any(ObjectId),
        email: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        role: expect.any(String),
      }),
    );
    expect(next).toHaveBeenCalledTimes(1);
    done();
  });

  it("handles already loggedin sessions", async done => {
    const validLogin = {
      email: "member@example.com",
      password: "password",
    };

    const session = {
      user: {
        id: "88",
        email: "member@example.com",
        firstName: "Member",
        lastName: "Member",
        role: "member",
      },
    };

    const req = mockRequest(null, session, validLogin);

    await localLogin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ err: alreadyLoggedIn });
    done();
  });
});