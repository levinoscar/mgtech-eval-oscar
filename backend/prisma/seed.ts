// prisma/seed.ts
// Production-safe seeding from a curated static file (seeds/seed.production.csv).
// Idempotent: re-running updates existing rows (matched by email) instead of
// creating duplicates.
import { PrismaClient, Role } from "@prisma/client";
import fs from "fs";
import path from "path";
import { hashPassword } from "../src/common/password";

const prisma = new PrismaClient();

interface SeedRow {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  password: string;
}

function parseCsv(filePath: string): SeedRow[] {
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  const lines = raw.split(/\r?\n/);
  const header = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = {} as Record<string, string>;
    header.forEach((h, i) => (row[h] = cols[i]));
    return row as unknown as SeedRow;
  });
}

async function main() {
  const csvPath = path.join(__dirname, "seeds", "seed.production.csv");
  const rows = parseCsv(csvPath);

  let created = 0;
  let updated = 0;
  const roleBreakdown: Record<string, number> = {};

  for (const row of rows) {
    const role = (row.role as Role) ?? "USER";
    const passwordHash = await hashPassword(row.password);

    const existing = await prisma.user.findUnique({
      where: { email: row.email },
    });

    const data = {
      firstName: row.firstName || null,
      lastName: row.lastName || null,
      role,
      passwordHash,
    };

    if (existing) {
      await prisma.user.update({ where: { email: row.email }, data });
      updated++;
    } else {
      await prisma.user.create({ data: { email: row.email, ...data } });
      created++;
    }

    roleBreakdown[role] = (roleBreakdown[role] ?? 0) + 1;
  }

  console.log("[seed:production] Done.");
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(
    `  Role breakdown: ${Object.entries(roleBreakdown)
      .map(([r, n]) => `${r}: ${n}`)
      .join(", ")}`
  );
}

main()
  .catch((err) => {
    console.error("[seed:production] Failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
