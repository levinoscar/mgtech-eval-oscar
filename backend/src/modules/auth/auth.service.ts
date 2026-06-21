// src/modules/auth/auth.service.ts
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { prisma } from "../../db/prismaClient";
import { env } from "../../config/env";
import { hashPassword, comparePassword } from "../../common/password";
import type { RegisterBody, LoginBody } from "./auth.validation";
import type { AuthTokenPayload, AuthTokens, AuthUser } from "./auth.types";

function signToken(payload: AuthTokenPayload): AuthTokens {
  const options: SignOptions = {
    // env.JWT_EXPIRES_IN is a string like "1h", which jsonwebtoken supports.
    // Cast as `any` to satisfy the slightly wonky type definition.
    expiresIn: env.JWT_EXPIRES_IN as any,
  };

  const accessToken = jwt.sign(
    payload,
    env.JWT_SECRET as Secret,
    options
  );

  return { accessToken };
}

export const authService = {
  async register(data: RegisterBody): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      const err: any = new Error("Email is already in use");
      err.status = 409;
      err.code = "EMAIL_TAKEN";
      throw err;
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        role: "USER", // default role
      },
    });

    const tokens = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      tokens,
    };
  },

  async login(data: LoginBody): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const isValid = await comparePassword(data.password, user.passwordHash);

    if (!isValid) {
      const err: any = new Error("Invalid email or password");
      err.status = 401;
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }

    const tokens = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, tokens };
  },

  async getMe(userId: string): Promise<AuthUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return null;

    return user;
  },
};
