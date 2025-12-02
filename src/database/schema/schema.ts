import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const Clients = pgTable("client", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  companyName: varchar("company_name", { length: 100 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }),
  email: text("email").unique().notNull(),
  phone: varchar("phone", { length: 50 }),
  addressStreet: varchar("address_street", { length: 255 }),
  addressCity: varchar("address_city", { length: 100 }),
  addressZip: varchar("address_zip", { length: 20 }),
  addressCountry: varchar("address_country", { length: 100 }),
});
