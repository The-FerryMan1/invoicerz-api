import { and, eq, sql, desc } from "drizzle-orm";
import { db } from "../../database";
import { Clients, Invoices, LineItems } from "../../database/schema/schema";
import { InvoicesModel } from "./model";
import { status } from "elysia";
import { GlobalModel } from "../../model/global.model";
import { generateInvoicePDF } from "../../utils/generateInvoice";

export namespace InvoicesService {
  export async function createInvoiceHeader(
    { clientID, dueDate, notes, taxRate, discount }: InvoicesModel.invoiceBody,
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
        discount,
      })
      .returning();

    return newInvoiceHeader;
  }

  export async function readInvoices(
    { page, limit }: GlobalModel.paginationQuery,
    userID: string
  ) {
    const offset = (Number(page) - 1) * Number(limit);
    const invoices = await db
      .select()
      .from(Invoices)
      .orderBy(desc(Invoices.createdAt))
      .offset(offset)
      .limit(Number(limit))
      .where(eq(Invoices.userID, userID));
    const totalClient = await db.$count(Invoices, eq(Invoices.userID, userID));

    const totalPages = Math.ceil(totalClient) || 0;

    const pagination: GlobalModel.pagination = {
      record: invoices,
      meta: {
        currentPage: Number(page),
        limit: Number(limit),
        recordsOnPage: invoices.length,
        totalPages,
        totalRecord: totalClient,
      },
    };

    return pagination;
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

  export async function generateInvoice(
    { invoiceID }: InvoicesModel.invoiceParams,
    userID: string
  ) {
    const invoiceIDInt = Number(invoiceID);
    if (isNaN(invoiceIDInt))
      throw status(400, "Bad Request: Parameter should be numeric.");

    const [invoice] = await db
      .select({
        id: Invoices.id,
        clientID: Invoices.id,
        invoiceNumber: Invoices.invoiceNumber,
        issueDate: Invoices.issueDate,
        dueDate: Invoices.dueDate,
        status: Invoices.status,
        subtotal: Invoices.subtotal,
        taxRate: Invoices.taxRate,
        totalAmount: Invoices.totalAmount,
        discount: Invoices.discount,
        notes: Invoices.notes,
        clientName: Clients.companyName,
        client: Clients.addressCity,
      })
      .from(Invoices)
      .innerJoin(Clients, eq(Invoices.clientID, Clients.id))
      .where(and(eq(Invoices.id, invoiceIDInt), eq(Invoices.userID, userID)));

    if (!invoice) throw status(404, "Not Found or Access denied.");

    const lineItems = await db
      .select()
      .from(LineItems)
      .orderBy(desc(LineItems.createdAt))
      .where(
        and(eq(LineItems.invoiceID, invoiceIDInt), eq(LineItems.userID, userID))
      );
    const taxableBase = invoice.subtotal - invoice.discount;
    const totalTaxAmount = taxableBase * (invoice.taxRate / 100);

    const invoicePDF = await generateInvoicePDF({
      invoices: invoice,
      items: lineItems,
    });

    return invoicePDF;
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
