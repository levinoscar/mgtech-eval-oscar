# Candidate Engineering Project

Welcome! This repository contains a small, partially implemented backend service designed for evaluating software engineering candidates.

Your task is to extend it, improve it, and demonstrate your ability to work within an existing codebase using modern development practices.

This project simulates contributing to a real internal system. Please treat it like production-quality work: readable code, tests, documentation, and thoughtful architecture all matter.

---

# 🧱 Tech Stack

The base project includes:

### **Backend**
- **Node.js + TypeScript**
- **Express or Fastify** (depending on which the repo uses)
- **Prisma ORM** (PostgreSQL)
- **Router → Controller → Service → Repository architecture**
- **Zod-based request validation**
- **JWT Authentication**
- **Role-Based Authorization (RBAC)**
- **Swagger/OpenAPI documentation**
- **Pino/Winston JSON logging**
- **Environment variable validation**
- **Dockerized local development**
- **Jest or Vitest test framework**
  - Unit tests
  - Integration / API tests

### **Database**
- PostgreSQL (via Docker)
- Prisma migrations + seed script

### **Optional Frontend**
A minimal Vue 3 scaffold may be provided, or you may build one yourself depending on the task assignment.

---

# 🚀 Getting Started

### **1. Clone the repository**
```bash
git clone <your-fork-url>
cd candidate-project
```

### **2. Set up environment variables**
Copy `.env.example` → `.env`:

```bash
cp .env.example .env
```

Fill in required values.  
All environment variables are validated at startup.

### **3. Start the stack**
```bash
docker-compose up --build
```

This will start:

- API server  
- PostgreSQL  
- Prisma migrations & seed (if configured)

API will be available at:

```
http://localhost:3000
```

Swagger docs:

```
http://localhost:3000/docs
```

---

# 📂 Project Structure

```
backend/
  src/
    config/
      env.ts
      logger.ts
    db/
      prismaClient.ts
    modules/
      auth/
        auth.router.ts
        auth.controller.ts
        auth.service.ts
        auth.repo.ts
      contacts/
        ...
      companies/
        ...
    middlewares/
      errorHandler.ts
      authGuard.ts
      validation.ts
    common/
      errors.ts
      result.ts
      pagination.ts
    tests/
      unit/
      integration/
    app.ts
    server.ts

prisma/
  schema.prisma
  migrations/
  seed.ts

docker-compose.yml
Dockerfile
README.md
```

---

# 📝 What You Will Be Evaluated On

We are looking for:

### ✔️ Correctness  
Implementation that works, handles edge cases, and respects existing architecture.

### ✔️ Code Quality  
Readable, maintainable, modular TypeScript.

### ✔️ Tests  
Meaningful unit & integration tests that prove your implementation works as intended.

### ✔️ API Design & Documentation  
Endpoints documented and consistent with OpenAPI standards.

### ✔️ Architecture Alignment  
Router → controller → service → repository patterns followed consistently.

### ✔️ Git Hygiene  
Good commit messages, sensible PR structure, logical grouping of changes.

---

# 🧪 Candidate Tasks

Below are the tasks you should complete.  
They are designed to reflect real work you might perform as part of our development team.

---

## **Task 1 — Implement a Feature: Company Contacts Endpoint**

Implement:

```
GET /companies/:companyId/contacts
```

Requirements:

- Returns all contacts belonging to a company.
- Supports pagination (`page`, `pageSize`).
- Supports optional search (`q`) filtering by name or email.
- Only authenticated users may access it.
- Must respect the architecture:
  - Router → Controller → Service → Repository
- Must include:
  - Zod validation for parameters
  - Swagger documentation
  - Unit tests for the service layer
  - Integration tests for the route

---

## **Task 2 — Improve Validation & Error Handling**

Extend the request validation for the endpoint:

```
POST /contacts
```

Add:

- Proper zod validation on all fields
- Friendly error messages
- Correct 400 response shape
- Swagger schema updates
- Tests for invalid requests

Goal: This endpoint should never return invalid or unhelpful errors.

---

## **Task 3 — Authorization Enhancement**

Add a new user role:

```
MANAGER
```

Rules:

- ADMIN and MANAGER can delete companies.
- Regular USER cannot.
- Enforce at appropriate middleware/service layer.
- Add tests proving unauthorized access is blocked.

---

## **(Optional) Task 4 — Frontend Mini-Challenge (Vue 3)**

If you choose to complete the frontend task:

Create a simple Vue 3 SPA that:

- Logs in a user
- Displays paginated contacts from `GET /contacts`
- Allows creating a new contact
- Handles loading & error states
- Uses Composition API

This is optional unless specifically requested in your instructions.

---

# 📤 Submitting Your Work

1. **Create a fork** of this repository.  
2. Do your work in a separate branch (e.g., `candidate/your-name`).  
3. Open a PR *against your own fork* and send us the link.  
4. Include a short write-up describing:
   - Design choices
   - Trade-offs
   - Anything you would improve with more time

---

# 🙋 Need Clarification?

If you believe requirements conflict, are ambiguous, or incomplete, note your assumptions in your write-up. Thoughtful clarification is part of the evaluation.

---

# 🎉 Good Luck!

We look forward to reviewing your work.  
Show us how you think, how you structure systems, and how you approach clean, maintainable engineering.
