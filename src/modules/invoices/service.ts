import { and, eq, sql } from "drizzle-orm";
import { db } from "../../database";
import { Invoices } from "../../database/schema/schema";
import { InvoicesModel } from "./model";
import { status } from "elysia";

export namespace InvoicesService {
  export async function createInvoiceHeader(
    { clientID, dueDate, notes, taxRate }: InvoicesModel.invoiceBody,
    userID: string
  ) {
    const countInvoices = await db.$count(
      Invoices,
      eq(Invoices.userID, userID)
    );

    const [newInvoiceHeader] = await db
      .insert(Invoices)
      .values({
        clientID,
        dueDate: dueDate.toISOString(),
        invoiceNumber: `INV-${new Date(Date.now()).getFullYear()}-${(
          "0000" +
          (countInvoices + 1)
        ).slice(-4)}`,
        subtotal: 0,
        taxRate,
        totalAmount: 0,
        userID,
        notes,
      })
      .returning();

    return newInvoiceHeader;
  }

  export async function readInvoices(userID: string) {
    const invoices = await db
      .select()
      .from(Invoices)
      .where(eq(Invoices.userID, userID));
    return invoices;
  }

  export async function readInvoicesByID(
    { invoiceID }: InvoicesModel.invoiceParams,
    userID: string
  ) {
    const invoiceIDInt = Number(invoiceID);
    if (isNaN(invoiceIDInt))
      throw status(400, "Parameter should be numberic or Access denied.");

    const [invoice] = await db
      .select()
      .from(Invoices)
      .where(and(eq(Invoices.id, invoiceIDInt), eq(Invoices.userID, userID)))
      .limit(1);

    if (!invoice) throw status(404, "Not Found or Access denied.");
    return invoice;
  }

  export async function updateInvoice(
    { invoiceID }: InvoicesModel.invoiceParams,
    { clientID, dueDate, notes, taxRate }: InvoicesModel.invoiceBody,
    userID: string
  ) {
    const invoiceIDInt = Number(invoiceID);
    if (isNaN(invoiceIDInt))
      throw status(400, "Parameter should be numberic or Access denied.");

    const [updatedInvoice] = await db
      .update(Invoices)
      .set({
        clientID,
        dueDate: String(dueDate),
        notes,
        taxRate,
      })
      .where(and(eq(Invoices.id, invoiceIDInt), eq(Invoices.userID, userID)))
      .returning();

    if (!updatedInvoice)
      throw status(
        500,
        "Internal Server Error: Failed to retrieve updated record."
      );

    return updatedInvoice;
  }

  //soft delete upcoming

  export async function deletedInvoice(
    { invoiceID }: InvoicesModel.invoiceParams,
    userID: string
  ) {
    const invoiceIDInt = Number(invoiceID);
    if (isNaN(invoiceIDInt))
      throw status(400, "Parameter should be numberic or Access denied.");

    const [deletedInvoice] = await db
      .delete(Invoices)
      .where(and(eq(Invoices.id, invoiceIDInt), eq(Invoices.userID, userID)))
      .returning({ id: Invoices.id });
    if (!deletedInvoice) throw status(404, "Not Found or Access denied.");
    return;
  }
}
