import { and, eq, sql } from "drizzle-orm";
import { db } from "../../database";
import {
  Invoices,
  LineItems,
  ProductService,
} from "../../database/schema/schema";
import { ItemsModel } from "./model";
import { status } from "elysia";

export namespace ItemsService {
  export async function createLineItem(
    {
      description,
      invoiceID,
      productServiceID,
      quantity,
      unitPrice,
    }: ItemsModel.itemsBody,
    userID: string
  ) {
    const newLineitem = await db.transaction(async (tx) => {
      const [invoiceHeader] = await tx
        .select({ taxRate: Invoices.taxRate, discount: Invoices.discount })
        .from(Invoices)
        .where(eq(Invoices.id, invoiceID));

      if (!invoiceHeader) throw status(404, "Invoice Not Found");

      const checkService = await tx.$count(
        ProductService,
        eq(ProductService.id, productServiceID)
      );

      if (checkService === 0) throw status(404, "Service/Product Not Found.");

      const newLineTotal = quantity * unitPrice;

      const [newLineitem] = await tx
        .insert(LineItems)
        .values({
          description,
          invoiceID,
          productServiceID,
          quantity,
          unitPrice,
          userID,
          lineTotal: newLineTotal,
        })
        .returning();

      const [lineItems] = await tx
        .select({
          newSubTotal: sql<number>`sum(${LineItems.lineTotal})`,
        })
        .from(LineItems)
        .where(
          and(eq(LineItems.userID, userID), eq(LineItems.invoiceID, invoiceID))
        );

      const taxableBase = lineItems.newSubTotal - invoiceHeader.discount;
      const taxAmount = taxableBase * (invoiceHeader.taxRate / 100);
      const newTotalAmount = taxableBase + taxAmount;

      await tx
        .update(Invoices)
        .set({
          subtotal: lineItems.newSubTotal,
          totalAmount: newTotalAmount,
        })
        .where(and(eq(Invoices.id, invoiceID)));

      return newLineitem;
    });

    return newLineitem;
  }

  export async function readLineItems(userID: string) {
    const lineItems = await db
      .select()
      .from(LineItems)
      .where(eq(LineItems.userID, userID));
    return lineItems;
  }

  export async function readLineItemByID(
    { lineItemID }: ItemsModel.itemsParams,
    userID: string
  ) {
    const lineItemIDInt = Number(lineItemID);
    if (isNaN(lineItemIDInt))
      throw status(400, "Bad Request, Parameter should be numeric.");

    const [lineItem] = await db
      .select()
      .from(LineItems)
      .where(and(eq(LineItems.id, lineItemIDInt), eq(LineItems.userID, userID)))
      .limit(1);

    if (!lineItem) throw status(404, "Not Found or Access denied.");

    return lineItem;
  }

  export async function updateLineItem(
    { lineItemID }: ItemsModel.itemsParams,
    {
      description,
      invoiceID,
      productServiceID,
      quantity,
      unitPrice,
    }: ItemsModel.itemsBody,
    userID: string
  ) {
    const lineItemIDInt = Number(lineItemID);
    if (isNaN(lineItemIDInt))
      throw status(400, "Bad Request, Parameter should be numeric.");

    const updatedLineItem = await db.transaction(async (tx) => {
      const [invoiceHeader] = await tx
        .select({ taxRate: Invoices.taxRate, discount: Invoices.discount })
        .from(Invoices)
        .where(eq(Invoices.id, invoiceID));

      if (!invoiceHeader) throw status(404, "Invoice Not Found");

      const checkService = await tx.$count(
        ProductService,
        eq(ProductService.id, productServiceID)
      );

      if (checkService === 0) throw status(404, "Service/Product Not Found.");

      const newLineTotal = quantity * unitPrice;

      const [updatedLineItem] = await db
        .update(LineItems)
        .set({
          description,
          invoiceID,
          productServiceID,
          quantity,
          unitPrice,
          lineTotal: newLineTotal,
        })
        .where(
          and(eq(LineItems.id, lineItemIDInt), eq(LineItems.userID, userID))
        )
        .returning();

      const [lineItems] = await tx
        .select({
          newSubTotal: sql<number>`sum(${LineItems.lineTotal})`,
        })
        .from(LineItems)
        .where(
          and(eq(LineItems.userID, userID), eq(LineItems.invoiceID, invoiceID))
        );

      const taxableBase = lineItems.newSubTotal - invoiceHeader.discount;
      const taxAmount = taxableBase * (invoiceHeader.taxRate / 100);
      const newTotalAmount = taxableBase + taxAmount;

      await tx
        .update(Invoices)
        .set({
          subtotal: lineItems.newSubTotal,
          totalAmount: newTotalAmount,
        })
        .where(and(eq(Invoices.id, invoiceID)));

      return updatedLineItem;
    });

    return updatedLineItem;
  }

  export async function deleteLineItem(
    { lineItemID }: ItemsModel.itemsParams,
    userID: string
  ) {
    const lineItemIDInt = Number(lineItemID);
    if (isNaN(lineItemIDInt))
      throw status(400, "Bad Request, Parameter should be numeric.");

    const deletedLineItemID = await db.transaction(async (tx) => {
      const [deletedLineItemID] = await db
        .delete(LineItems)
        .where(
          and(eq(LineItems.id, lineItemIDInt), eq(LineItems.userID, userID))
        )
        .returning();

      const [invoiceHeader] = await tx
        .select({ taxRate: Invoices.taxRate, discount: Invoices.discount })
        .from(Invoices)
        .where(eq(Invoices.id, deletedLineItemID.invoiceID));

      const [lineItems] = await tx
        .select({
          newSubTotal: sql<number>`sum(${LineItems.lineTotal})`,
        })
        .from(LineItems)
        .where(
          and(
            eq(LineItems.userID, userID),
            eq(LineItems.invoiceID, deletedLineItemID.invoiceID)
          )
        );

      const taxableBase = lineItems.newSubTotal - invoiceHeader.discount;
      const taxAmount = taxableBase * (invoiceHeader.taxRate / 100);
      const newTotalAmount = taxableBase + taxAmount;

      await tx
        .update(Invoices)
        .set({
          subtotal: lineItems.newSubTotal,
          totalAmount: newTotalAmount,
        })
        .where(and(eq(Invoices.id, deletedLineItemID.invoiceID)));

      return deletedLineItemID;
    });

    if (!deletedLineItemID) throw status(404, "Not Found or Access denied.");
    return;
  }
}
