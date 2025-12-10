import { seed } from "drizzle-seed";
import * as schema from "../schema/schema";
import { drizzle } from "drizzle-orm/node-postgres";
export async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  console.log("seeding...");
  await seed(db, { schema }, { count: 500 });
}
