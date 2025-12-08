// src/docs/swagger.ts
import { version } from "../../package.json";

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Candidate Evaluation API",
    version,
    description:
      "API used for evaluating software engineering candidates. Includes auth, users, and related resources.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local dev",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "ckv123..." },
          email: { type: "string", example: "user@example.com" },
          firstName: { type: "string", nullable: true, example: "Ada" },
          lastName: { type: "string", nullable: true, example: "Lovelace" },
          role: { type: "string", example: "USER" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedUsersResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
          meta: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              pageSize: { type: "integer", example: 20 },
              total: { type: "integer", example: 57 },
              totalPages: { type: "integer", example: 3 },
              search: { type: "string", nullable: true, example: "ada" },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/users": {
      get: {
        tags: ["Users"],
        summary: "List users",
        description:
          "Returns a paginated list of users. Supports simple full-text search on email, first name, and last name.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
            description: "Page number (1-based).",
          },
          {
            in: "query",
            name: "pageSize",
            schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
            description: "Number of items per page.",
          },
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
            description:
              "Optional search term. Matches email, firstName, or lastName (case-insensitive).",
          },
        ],
        responses: {
          200: {
            description: "Successful response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedUsersResponse" },
              },
            },
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};
