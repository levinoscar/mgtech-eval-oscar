# Candidate Engineering Project

Welcome! This repository contains a small, partially implemented backend service designed for evaluating software engineering candidates.

Your task is to extend it, improve it, and demonstrate your ability to work within an existing codebase using modern development practices.

This project simulates contributing to a real internal system. Please treat it like production-quality work: readable code, tests, documentation, and thoughtful architecture all matter.

---

# 🧱 Tech Stack

The base project includes:

### **Backend**
- **Node.js + TypeScript**
- **Express or Fastify**
- **Prisma ORM** (PostgreSQL)
- **Router → Controller → Service → Repository architecture**
- **Zod-based request validation**
- **JWT Authentication**
- **Role-Based Authorization (RBAC)**
- **Swagger/OpenAPI documentation**
- **Pino/Winston JSON logging**
- **Environment variable validation**
- **Dockerized local development**
- **Jest or Vitest test framework** (unit + API tests)

### **Database**
- PostgreSQL (via Docker)
- Prisma migrations + seed script

### **Optional Frontend**
A minimal Vue 3 scaffold may be provided, or you may build one yourself depending on the task assignment.

---

# 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <your-fork-url>
cd candidate-project
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

### 3. Start the stack
```bash
docker-compose up --build
```

API available at:

```
http://localhost:3000
```

Swagger docs at:

```
http://localhost:3000/docs
```

---

# 📂 Project Structure

```
backend/
  src/
    config/
    db/
    modules/
      auth/
      users/
      ...
    middlewares/
    common/
    tests/
    app.ts
    server.ts

prisma/
docker-compose.yml
Dockerfile
README.md
```

---

# 📝 What You Will Be Evaluated On

- ✔️ **Correctness**
- ✔️ **Code Quality**
- ✔️ **Testing coverage & quality**
- ✔️ **API design & documentation**
- ✔️ **Architecture alignment**
- ✔️ **Git hygiene & commits**

---

# 🧪 Candidate Task Tracks

Choose **ONE** task track that best aligns with your background.  
(You may complete more than one if you want to demonstrate broader capability.)

---

# 🎨 Track A — Frontend SPA Challenge (Frontend-Oriented Candidates)

Build a **Single Page Application (SPA)** that interacts with this backend API.

### Requirements

- Use **Vue 3 (recommended)** or any modern JS framework
- Implement:
  - Registration (`POST /auth/register`)
  - Login (JWT) (`POST /auth/login`)
  - Store & persist JWT
  - `/auth/me` profile page
  - User listing (`GET /users`)
- Handle:
  - Loading & error states
  - Validation & API errors
- UI expectations:
  - Clean and functional UI

### Bonus
- Router integration (Vue Router, React Router)
- Reusable component structure
- Search/filter users

### Deliverables
- `/frontend` folder or separate repo
- README explaining setup & architecture

---

# 🛢️ Track B — Database & Migration Challenge (Backend/DB-Focused Candidates)

Choose **one** of the DB tasks below.

---

## **Option B1 — PostgreSQL → MySQL Migration**

You will:

1. Update Prisma schema to support MySQL
2. Add MySQL to Docker Compose
3. Update migrations to new SQL engine
4. Adapt enum behavior, relations, and indexes
5. Validate full API functionality post-migration

This evaluates:

- SQL engine knowledge  
- Prisma migration expertise  
- Infrastructure adaptation skills  

---

## **Option B2 — Add a New Module With Complex Relationships**

Examples:
- `Projects`
- `Teams`
- `Organizations`
- `Locations`

Your module must include:

- 1-to-many and many-to-many relationships  
- Composite unique keys  
- Cascading or restricted delete rules  
- Paginated list APIs  
- Integration tests validating constraints  

---

# 🔌 Track C — API Expansion (Nested Data Model Track)

Extend the API by adding a **nested relational model** tied to the `User` entity.

### Examples:
- `UserSettings`
- `UserNotifications`
- `UserSecurityLogs`
- `UserProfiles`
- `UserSessions`

### Requirements

1. Add new Prisma models + migration
2. Create new module folder:
   ```
   settings/
     settings.router.ts
     settings.controller.ts
     settings.service.ts
     settings.repo.ts
   ```
3. Routes:
   - `GET /users/:id/settings`
   - `PUT /users/:id/settings`
4. Zod validation
5. Authorization rules:
   - A user may only modify **their own** settings  
   - ADMIN may modify any user
6. Add Swagger documentation

### Testing

- Must include integration tests for:
  - Access control (user vs admin)
  - Upsert/update behavior  

---

# 📤 Submitting Your Work

1. Fork the repository  
2. Create a feature branch (`candidate/<your-name>`)  
3. Open a PR **to your own fork**  
4. Include a write-up describing:
   - Architecture decisions  
   - Trade-offs you made  
   - Improvements you'd make with more time  

---

# 🙋 Need Clarification?

If any task feels ambiguous, conflicting, or incomplete, document your assumptions.  
Thoughtful reasoning is part of the evaluation.

---

# 🎉 Good Luck!

We look forward to reviewing your work.
