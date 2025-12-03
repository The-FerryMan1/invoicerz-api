import { and, eq, sql } from "drizzle-orm";
import { db } from "../../database";
import { LineItems } from "../../database/schema/schema";
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
    const [newLineitem] = await db
      .insert(LineItems)
      .values({
        description,
        invoiceID,
        productServiceID,
        quantity,
        unitPrice,
        userID,
        lineTotal: sql`${quantity} * ${unitPrice}`,
      })
      .returning();

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

    const [updatedLineItem] = await db
      .update(LineItems)
      .set({
        description,
        invoiceID,
        productServiceID,
        quantity,
        unitPrice,
        lineTotal: sql`${quantity} * ${unitPrice}`,
      })
      .where(and(eq(LineItems.id, lineItemIDInt), eq(LineItems.userID, userID)))
      .returning();

    if (!updatedLineItem)
      throw status(
        500,
        "Internal Server Error: Failed to retrieve updated record."
      );

    return updatedLineItem;
  }

  export async function deleteLineItem(
    { lineItemID }: ItemsModel.itemsParams,
    userID: string
  ) {
    const lineItemIDInt = Number(lineItemID);
    if (isNaN(lineItemIDInt))
      throw status(400, "Bad Request, Parameter should be numeric.");

    const [deletedLineItemID] = await db
      .delete(LineItems)
      .where(and(eq(LineItems.id, lineItemIDInt), eq(LineItems.userID, userID)))
      .returning({ id: LineItems.id });

    if (!deletedLineItemID) throw status(404, "Not Found or Access denied.");
    return;
  }
}
