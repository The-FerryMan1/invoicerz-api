import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export enum InvoicesStatusEnum {
  Draft = "Draft",
  Sent = "Sent",
  Paid = "Paid",
  Overdue = "Overdue",
  Canceled = "Canceled",
}

export const InvoicesStatus = pgEnum("invoice_status", InvoicesStatusEnum);

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

export const Invoices = pgTable("invoice", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clientID: integer("client_id")
    .references(() => Clients.id, { onDelete: "cascade" })
    .notNull(),
  userID: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
  issueDate: date("issue_date").notNull().defaultNow(),
  dueDate: date("due_date").notNull(),
  status: InvoicesStatus("status").notNull().default(InvoicesStatusEnum.Draft),
  subtotal: numeric("subtotal", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  taxRate: numeric("tax_rate", {
    mode: "number",
    precision: 5,
    scale: 2,
  }).notNull(),
  totalAmount: numeric("total_amount", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  discount: numeric("discount", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  notes: text("notes"),
});

export const ProductService = pgTable("productservice", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  unitPrice: numeric("unit_price", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  isService: boolean("is_service").notNull(),
});

export const LineItems = pgTable("lineitems", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userID: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  invoiceID: integer("invoice_id")
    .references(() => Invoices.id, { onDelete: "cascade" })
    .notNull(),
  productServiceID: integer("productservice_id")
    .references(() => ProductService.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description").notNull(),
  quantity: numeric("quantity", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  unitPrice: numeric("unit_price", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
  lineTotal: numeric("line_total", {
    mode: "number",
    precision: 10,
    scale: 2,
  }).notNull(),
});
