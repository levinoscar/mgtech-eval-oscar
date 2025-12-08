// src/tests/unit/authService.test.ts
import { authService } from "../../modules/auth/auth.service";
import { prisma } from "../../db/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../db/prismaClient", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("fake-jwt-token"),
}));

const mockedPrisma = prisma as unknown as {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

const mockedBcrypt = bcrypt as unknown as {
  hash: jest.Mock;
  compare: jest.Mock;
};

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("creates a new user and returns user + tokens", async () => {
      mockedPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockedBcrypt.hash.mockResolvedValueOnce("hashed-password");

      const fakeUser = {
        id: "user_1",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
        role: "USER",
        passwordHash: "hashed-password",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      };

      mockedPrisma.user.create.mockResolvedValueOnce(fakeUser);

      const result = await authService.register({
        email: "test@example.com",
        password: "SuperSecret123!",
        firstName: "Test",
        lastName: "User",
      });

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith("SuperSecret123!", 10);

      expect(mockedPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@example.com",
          passwordHash: "hashed-password",
          firstName: "Test",
          lastName: "User",
          role: "USER",
        },
      });

      expect(jwt.sign).toHaveBeenCalled();

      expect(result).toEqual({
        user: fakeUser,
        tokens: {
          accessToken: "fake-jwt-token",
        },
      });
    });

    it("throws when email is already in use", async () => {
      mockedPrisma.user.findUnique.mockResolvedValueOnce({
        id: "existing",
        email: "used@example.com",
      });

      await expect(
        authService.register({
          email: "used@example.com",
          password: "SuperSecret123!",
          firstName: "Test",
          lastName: "User",
        })
      ).rejects.toMatchObject({
        status: 409,
        code: "EMAIL_TAKEN",
      });
    });
  });

  describe("login", () => {
    it("returns user + tokens when credentials are valid", async () => {
      const fakeUser = {
        id: "user_1",
        email: "login@example.com",
        firstName: "Login",
        lastName: "User",
        role: "USER",
        passwordHash: "hashed-password",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      };

      mockedPrisma.user.findUnique.mockResolvedValueOnce(fakeUser);
      mockedBcrypt.compare.mockResolvedValueOnce(true);

      const result = await authService.login({
        email: "login@example.com",
        password: "SuperSecret123!",
      });

      expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "login@example.com" },
      });

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        "SuperSecret123!",
        "hashed-password"
      );

      expect(jwt.sign).toHaveBeenCalled();

      expect(result).toEqual({
        user: fakeUser,
        tokens: { accessToken: "fake-jwt-token" },
      });
    });

    it("throws for invalid email", async () => {
      mockedPrisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.login({
          email: "missing@example.com",
          password: "whatever",
        })
      ).rejects.toMatchObject({
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    });

    it("throws for invalid password", async () => {
      const fakeUser = {
        id: "user_1",
        email: "login@example.com",
        firstName: "Login",
        lastName: "User",
        role: "USER",
        passwordHash: "hashed-password",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      };

      mockedPrisma.user.findUnique.mockResolvedValueOnce(fakeUser);
      mockedBcrypt.compare.mockResolvedValueOnce(false);

      await expect(
        authService.login({
          email: "login@example.com",
          password: "wrong-password",
        })
      ).rejects.toMatchObject({
        status: 401,
        code: "INVALID_CREDENTIALS",
      });
    });
  });
});
