import { t } from "elysia";
import { InvoicesStatusEnum } from "../../database/schema/schema";
import { Invoices } from "../../database/schema/schema";

type InvoicesType = typeof Invoices.$inferSelect;

export namespace InvoicesModel {
  export const invoiceBody = t.Object({
    clientID: t.Number(),
    dueDate: t.Date(),
    taxRate: t.Numeric(),
    notes: t.Union([t.String(), t.Null()]),
  });

  export type invoiceBody = typeof invoiceBody.static;

  export const invoiceResponse = t.Object({
    id: t.Number(),
    clientID: t.Number(),
    invoiceNumber: t.String(),
    issueDate: t.String(),
    dueDate: t.String(),
    status: t.Enum(InvoicesStatusEnum),
    subtotal: t.Numeric(),
    taxRate: t.Numeric(),
    totalAmount: t.Numeric(),
    notes: t.String(),
  });

  export type invoiceResponse = typeof invoiceResponse.static;

  export const invoiceParams = t.Object({
    invoiceID: t.Number(),
  });

  export type invoiceParams = typeof invoiceParams.static;
}
