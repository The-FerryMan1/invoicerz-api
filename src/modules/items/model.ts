import { t } from "elysia";

export namespace ItemsModel {
  export const itemsBody = t.Object({
    invoiceID: t.Number(),
    productServiceID: t.Number(),
    description: t.String(),
    quantity: t.Number(),
    unitPrice: t.Number(),
  });

  export type itemsBody = typeof itemsBody.static;

  export const itemsResponse = t.Object({
    id: t.Number(),
    invoiceID: t.Number(),
    productServiceID: t.Number(),
    description: t.String(),
    quantity: t.Number(),
    unitPrice: t.Number(),
    lineTotal: t.Numeric(),
  });

  export type itemsResponse = typeof itemsResponse.static;

  export const itemsResponseArray = t.Array(itemsResponse);

  export type itemsResponseArray = typeof itemsResponseArray.static;

  export const itemsParams = t.Object({
    lineItemID: t.String(),
  });

  export type itemsParams = typeof itemsParams.static;
}
