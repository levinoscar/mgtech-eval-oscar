// src/tests/integration/authApi.test.ts
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../db/prismaClient";

const app = createApp();

describe("Auth API integration", () => {
  jest.setTimeout(15000);

  const password = "SuperSecret123!";
  const email = `auth.test+${Date.now()}@example.com`;

  let accessToken: string;

  afterAll(async () => {
    // Clean up this test user so you can re-run tests cleanly
    await prisma.user.deleteMany({
      where: { email },
    });
    await prisma.$disconnect();
  });

  it("registers a new user and returns tokens", async () => {
    const res = await request(app).post("/auth/register").send({
      email,
      password,
      firstName: "Auth",
      lastName: "Tester",
    });

    expect(res.status).toBe(201);

    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          email,
          firstName: "Auth",
          lastName: "Tester",
          role: "USER",
        },
        tokens: {
          accessToken: expect.any(String),
        },
      },
    });
  });

  it("logs in the existing user and returns tokens", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
      password,
    });

    expect(res.status).toBe(200);

    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          email,
        },
        tokens: {
          accessToken: expect.any(String),
        },
      },
    });

    accessToken = res.body.data.tokens.accessToken;
    expect(accessToken).toBeTruthy();
  });

  it("returns the current user from /auth/me with a valid token", async () => {
    const res = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toMatchObject({
      success: true,
      data: {
        email,
        firstName: "Auth",
        lastName: "Tester",
        role: "USER",
      },
    });
  });

  it("returns 401 for /auth/me without a token", async () => {
    const res = await request(app).get("/auth/me");

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      success: false,
      error: {
        code: expect.stringMatching(/UNAUTHORIZED|INVALID_TOKEN/i),
      },
    });
  });
});
