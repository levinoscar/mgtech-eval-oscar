import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../db/prismaClient";

const app = createApp();

describe("User settings API integration", () => {
  const ts = Date.now();
  const userAEmail = `settings.a+${ts}@example.com`;
  const userBEmail = `settings.b+${ts}@example.com`;
  const adminEmail = `settings.admin+${ts}@example.com`;
  const cascadeEmail = `settings.cascade+${ts}@example.com`;
  const password = "password123";

  let userAId: string;
  let userAToken: string;
  let userBToken: string;
  let adminToken: string;

  const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    const a = await request(app)
      .post("/auth/register")
      .send({ email: userAEmail, password });
    userAId = a.body.data.user.id;
    userAToken = a.body.data.tokens.accessToken;

    const b = await request(app)
      .post("/auth/register")
      .send({ email: userBEmail, password });
    userBToken = b.body.data.tokens.accessToken;

    // Register an admin, promote it in the DB, then log in again so the JWT
    // carries the ADMIN role claim.
    await request(app).post("/auth/register").send({ email: adminEmail, password });
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "ADMIN" },
    });
    const adminLogin = await request(app)
      .post("/auth/login")
      .send({ email: adminEmail, password });
    adminToken = adminLogin.body.data.tokens.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [userAEmail, userBEmail, adminEmail, cascadeEmail] } },
    });
    await prisma.$disconnect();
  });

  describe("authentication & authorization", () => {
    it("returns 401 without a token", async () => {
      const res = await request(app).get(`/users/${userAId}/settings`);
      expect(res.status).toBe(401);
    });

    it("lets a user read their own settings (defaults on first read)", async () => {
      const res = await request(app)
        .get(`/users/${userAId}/settings`)
        .set(auth(userAToken));

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        data: {
          userId: userAId,
          theme: "SYSTEM",
          language: "en",
          emailNotifications: true,
        },
      });
    });

    it("forbids reading another user's settings (403)", async () => {
      const res = await request(app)
        .get(`/users/${userAId}/settings`)
        .set(auth(userBToken));

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("lets an ADMIN read any user's settings (200)", async () => {
      const res = await request(app)
        .get(`/users/${userAId}/settings`)
        .set(auth(adminToken));

      expect(res.status).toBe(200);
      expect(res.body.data.userId).toBe(userAId);
    });

    it("forbids updating another user's settings (403)", async () => {
      const res = await request(app)
        .put(`/users/${userAId}/settings`)
        .set(auth(userBToken))
        .send({ theme: "LIGHT" });

      expect(res.status).toBe(403);
    });
  });

  describe("upsert / update behavior", () => {
    it("updates own settings via PUT and persists across reads", async () => {
      const put = await request(app)
        .put(`/users/${userAId}/settings`)
        .set(auth(userAToken))
        .send({ theme: "DARK", emailNotifications: false });

      expect(put.status).toBe(200);
      expect(put.body.data).toMatchObject({
        theme: "DARK",
        emailNotifications: false,
      });

      const get = await request(app)
        .get(`/users/${userAId}/settings`)
        .set(auth(userAToken));
      expect(get.body.data.theme).toBe("DARK");
      expect(get.body.data.emailNotifications).toBe(false);
    });

    it("lets an ADMIN update any user's settings", async () => {
      const res = await request(app)
        .put(`/users/${userAId}/settings`)
        .set(auth(adminToken))
        .send({ language: "es" });

      expect(res.status).toBe(200);
      expect(res.body.data.language).toBe("es");
    });

    it("rejects an invalid theme (400)", async () => {
      const res = await request(app)
        .put(`/users/${userAId}/settings`)
        .set(auth(userAToken))
        .send({ theme: "NEON" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects unexpected fields (400)", async () => {
      const res = await request(app)
        .put(`/users/${userAId}/settings`)
        .set(auth(userAToken))
        .send({ hacker: true });

      expect(res.status).toBe(400);
    });

    it("returns 404 for a non-existent user", async () => {
      const res = await request(app)
        .get(`/users/does-not-exist/settings`)
        .set(auth(adminToken));

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("USER_NOT_FOUND");
    });
  });

  describe("cascade delete", () => {
    it("deletes settings when the owning user is deleted", async () => {
      const user = await prisma.user.create({
        data: { email: cascadeEmail, passwordHash: "x" },
      });
      await prisma.userSettings.create({
        data: { userId: user.id, theme: "DARK" },
      });

      await prisma.user.delete({ where: { id: user.id } });

      const settings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
      });
      expect(settings).toBeNull();
    });
  });
});
