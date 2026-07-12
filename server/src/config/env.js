require("dotenv").config();
const z = require("zod");

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(3001),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  GOOGLE_CHAT_WEBHOOK: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

module.exports = parsed.data;
