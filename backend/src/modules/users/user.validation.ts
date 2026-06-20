// src/modules/users/user.validation.ts
import { z } from "zod";

// ---------------------------------------------------------------------------
// GET /users — query parameters
//
// Query params always arrive as strings (e.g. "?page=2"), so we use
// `z.coerce.number()` to turn "2" into the number 2 before validating.
// `.default()` fills in a value when the param is missing entirely.
// ---------------------------------------------------------------------------
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).optional(),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

// ---------------------------------------------------------------------------
// POST /users — request body
//
// `.strict()` makes the schema reject any field we did not explicitly list,
// so callers can't sneak in unexpected properties.
// ---------------------------------------------------------------------------
export const createUserBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    role: z.enum(["USER", "MANAGER", "ADMIN"]).optional(),
  })
  .strict();

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
