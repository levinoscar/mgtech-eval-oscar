// src/modules/settings/settings.validation.ts
import { z } from "zod";

// PUT /users/:userId/settings — request body.
//
// All fields are optional so callers can update a subset (a partial update
// applied via upsert). `.strict()` rejects any unexpected field.
export const updateSettingsBodySchema = z
  .object({
    theme: z.enum(["LIGHT", "DARK", "SYSTEM"]).optional(),
    language: z.string().trim().min(2).max(10).optional(),
    emailNotifications: z.boolean().optional(),
  })
  .strict();

export type UpdateSettingsBody = z.infer<typeof updateSettingsBodySchema>;
