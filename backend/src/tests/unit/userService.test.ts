// src/tests/unit/userService.test.ts
import { userService } from "../../modules/users/user.service";
import { userRepo } from "../../modules/users/user.repo";

jest.mock("../../modules/users/user.repo", () => {
  return {
    userRepo: {
      findPaginated: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    },
  };
});

describe("userService.listUsers", () => {
  it("should call repo with normalized pagination and return paginated result", async () => {
    const mockedResult = {
      items: [
        {
          id: "user_1",
          email: "user1@example.com",
          firstName: "User",
          lastName: "One",
          role: "USER",
          createdAt: new Date("2025-01-01T00:00:00.000Z"),
          updatedAt: new Date("2025-01-01T00:00:00.000Z"),
        },
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      search: "user",
    };

    (userRepo.findPaginated as jest.Mock).mockResolvedValueOnce(mockedResult);

    const result = await userService.listUsers({
      page: 1,
      pageSize: 10,
      search: "user",
    });

    expect(userRepo.findPaginated).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      search: "user",
    });

    expect(result).toEqual(mockedResult);
  });

  it("should clamp page and pageSize into allowed ranges", async () => {
    (userRepo.findPaginated as jest.Mock).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 100,
      totalPages: 1,
      search: undefined,
    });

    await userService.listUsers({
      // Bad values that should get sanitized by service
      page: -5,
      pageSize: 999,
      search: " ",
    });

    expect(userRepo.findPaginated).toHaveBeenCalledWith({
      page: 1,
      pageSize: 100,
      search: undefined,
    });
  });
});
