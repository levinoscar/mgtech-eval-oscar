import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../db/prismaClient";

const app = createApp();

describe("Users API integration", () => {
  // Unique emails so the tests can be re-run cleanly and stay independent.
  const createdEmail = `user.create+${Date.now()}@example.com`;
  const dupEmail = `user.dup+${Date.now()}@example.com`;

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [createdEmail, dupEmail] } },
    });
    await prisma.$disconnect();
  });

  describe("GET /users", () => {
    it("returns 200 and a paginated users response with defaults", async () => {
      const res = await request(app).get("/users");

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        meta: {
          page: 1,
          pageSize: 20,
          total: expect.any(Number),
          totalPages: expect.any(Number),
        },
      });
    });

    it("rejects a non-numeric page with 400 VALIDATION_ERROR", async () => {
      const res = await request(app).get("/users?page=banana");

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        success: false,
        error: { code: "VALIDATION_ERROR" },
      });
    });

    it("rejects a pageSize over the max of 100", async () => {
      const res = await request(app).get("/users?pageSize=9999");

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /users", () => {
    it("creates a user (201) with the default USER role and never returns the password hash", async () => {
      const res = await request(app).post("/users").send({
        email: createdEmail,
        password: "password123",
        firstName: "Create",
        lastName: "Tester",
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          email: createdEmail,
          role: "USER", // role is not settable via this endpoint
        },
      });
      // Critical: the hash must not leak to clients.
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it("rejects a caller-supplied role and unexpected fields with 400", async () => {
      const res = await request(app).post("/users").send({
        email: "bad.role@example.com",
        password: "password123",
        role: "ADMIN", // not an accepted field -> rejected by .strict()
        isAdmin: true,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects a too-short password with 400", async () => {
      const res = await request(app).post("/users").send({
        email: "short.pw@example.com",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("returns 409 when the email already exists", async () => {
      // Self-contained: create the user here rather than relying on a prior test.
      const first = await request(app).post("/users").send({
        email: dupEmail,
        password: "password123",
      });
      expect(first.status).toBe(201);

      const res = await request(app).post("/users").send({
        email: dupEmail,
        password: "password123",
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("EMAIL_TAKEN");
    });
  });
});
