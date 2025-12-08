import request from "supertest";
import { createApp } from "../../app";

const app = createApp();

describe("Users API integration", () => {
  it("should return 200 and a paginated users response", async () => {
    const res = await request(app).get("/users");

    expect(res.status).toBe(200);

    expect(res.body).toMatchObject({
      success: true,
      data: expect.any(Array),
      meta: {
        page: expect.any(Number),
        pageSize: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      },
    });

    // Optional: more strict checks
    const { meta } = res.body;
    expect(meta.page).toBeGreaterThanOrEqual(1);
    expect(meta.pageSize).toBeGreaterThanOrEqual(1);
    expect(meta.totalPages).toBeGreaterThanOrEqual(1);
  });
});
