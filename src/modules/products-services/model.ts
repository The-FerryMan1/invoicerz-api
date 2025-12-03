import { t } from "elysia";

export namespace ProductServiceModel {
  export const productServiceBody = t.Object({
    name: t.String(),
    description: t.Union([t.String(), t.Null()]),
    unitPrice: t.Numeric(),
    isService: t.Boolean(),
  });

  export type productServiceBody = typeof productServiceBody.static;

  export const productServiceResponse = t.Object({
    id: t.Number(),
    name: t.String(),
    description: t.Union([t.String(), t.Null()]),
    unitPrice: t.Numeric(),
    isService: t.Boolean(),
  });
  export type productServiceResponse = typeof productServiceResponse.static;

  export const productServiceResponseArray = t.Array(productServiceResponse);

  export type productServiceResponseArray =
    typeof productServiceResponseArray.static;

  export const productServiceParams = t.Object({
    productServiceID: t.String(),
  });

  export type productServiceParams = typeof productServiceParams.static;
}
