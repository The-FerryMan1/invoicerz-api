import { t } from "elysia";

export namespace ClientModel {
  export const clientBody = t.Object({
    companyName: t.String(),
    contactPerson: t.Union([t.String(), t.Null()]),
    email: t.String(),
    phone: t.Union([t.String(), t.Null()]),
    addressStreet: t.Union([t.String(), t.Null()]),
    addressCity: t.Union([t.String(), t.Null()]),
    addressZip: t.Union([t.String(), t.Null()]),
    addressCountry: t.Union([t.String(), t.Null()]),
  });

  export type clientBody = typeof clientBody.static;

  export const clientResponse = t.Object({
    id: t.Number(),
    userID: t.String(),
    companyName: t.String(),
    contactPerson: t.Union([t.String(), t.Null()]),
    email: t.String(),
    phone: t.Union([t.String(), t.Null()]),
    addressStreet: t.Union([t.String(), t.Null()]),
    addressCity: t.Union([t.String(), t.Null()]),
    addressZip: t.Union([t.String(), t.Null()]),
    addressCountry: t.Union([t.String(), t.Null()]),
  });

  export type clientResponse = typeof clientResponse.static;

  export const clientResponseArray = t.Array(clientResponse);
  export type clientResponseArray = typeof clientResponseArray.static;
  export const clientIDParam = t.Object({
    clientID: t.String(),
  });

  export type clientIDParam = typeof clientIDParam.static;
}
