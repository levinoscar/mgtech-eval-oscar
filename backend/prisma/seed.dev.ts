// prisma/seed.dev.ts
// Development-only seeding: generates a large set of realistic fake users with
// Faker. Refuses to run in production so it can never pollute real data.
import { PrismaClient, Role } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hashPassword } from "../src/common/password";

const prisma = new PrismaClient();

const TOTAL_USERS = 300;
const DEV_PASSWORD = "Password123!";

function guardEnvironment() {
  const nodeEnv = process.env.NODE_ENV;
  const seedMode = process.env.SEED_MODE;
  if (nodeEnv === "production" || seedMode === "production") {
    throw new Error(
      "Refusing to run Faker-based dev seeding in a production environment " +
        "(NODE_ENV=production or SEED_MODE=production)."
    );
  }
}

function pickRole(index: number): Role {
  if (index === 0) return "ADMIN"; // guarantee at least one ADMIN
  if (index % 20 === 0) return "MANAGER"; // ~5% managers
  return "USER";
}

async function main() {
  guardEnvironment();

  // Hash once and reuse — every dev user shares the same password, which keeps
  // seeding fast and lets you log in as anyone during development.
  const passwordHash = await hashPassword(DEV_PASSWORD);

  const users = Array.from({ length: TOTAL_USERS }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    // Random domain suffix keeps emails unique across repeated runs.
    const email = faker.internet
      .email({
        firstName,
        lastName,
        provider: `${faker.string.alphanumeric(6)}.example.com`,
      })
      .toLowerCase();

    return { email, firstName, lastName, role: pickRole(i), passwordHash };
  });

  const result = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  const roleBreakdown = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1;
    return acc;
  }, {});

  console.log("[seed:dev] Done.");
  console.log(`  Requested: ${TOTAL_USERS}, inserted: ${result.count}`);
  console.log(
    `  Role breakdown: ${Object.entries(roleBreakdown)
      .map(([r, n]) => `${r}: ${n}`)
      .join(", ")}`
  );
  console.log(`  All dev users share the password: ${DEV_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("[seed:dev] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
