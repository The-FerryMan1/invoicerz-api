import Elysia from "elysia";
import { betterAuth } from "../../middleware/betterAuth";
import { InvoicesModel } from "./model";
import { InvoicesService } from "./service";
import { GlobalModel } from "../../model/global.model";

export const invoices = new Elysia({ prefix: "invoices" })
  .use(betterAuth)
  .post(
    "/",
    async ({ user, set, body }) => {
      const response = await InvoicesService.createInvoiceHeader(body, user.id);
      set.status = 201;
      return response;
    },
    {
      auth: true,
      body: InvoicesModel.invoiceBody,
      response: {
        201: InvoicesModel.invoiceResponse,
      },
    }
  )
  .get(
    "/",
    async ({ user, set, query: { limit, page } }) => {
      const response = await InvoicesService.readInvoices(
        { limit, page },
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      query: GlobalModel.paginationQuery,
      response: {
        200: GlobalModel.pagination,
      },
    }
  )
  .get(
    "/:invoiceID",
    async ({ user, set, params: { invoiceID } }) => {
      const response = await InvoicesService.readInvoicesByID(
        { invoiceID },
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: InvoicesModel.invoiceParams,
      response: {
        200: InvoicesModel.invoiceResponse,
      },
    }
  )
  .get(
    "/:invoiceID/generate",
    async ({ user, set, params: { invoiceID } }) => {
      const response = await InvoicesService.generateInvoice(
        { invoiceID },
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: InvoicesModel.invoiceParams,
    }
  )
  .put(
    "/:invoiceID",
    async ({ user, set, body, params: { invoiceID } }) => {
      const response = await InvoicesService.updateInvoice(
        { invoiceID },
        body,
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: InvoicesModel.invoiceParams,
      body: InvoicesModel.invoiceBody,
      response: {
        200: InvoicesModel.invoiceResponse,
      },
    }
  )
  .delete(
    "/:invoiceID",
    async ({ user, set, params: { invoiceID } }) => {
      const response = await InvoicesService.deletedInvoice(
        { invoiceID },
        user.id
      );
      set.status = 204;
      return;
    },
    {
      auth: true,
      params: InvoicesModel.invoiceParams,
    }
  )
  .get('/count', async({user, set, query:period})=>{
    const response = await InvoicesService.countInvoices(user.id, period)
    set.status = 200
    return response
  },{
    auth: true,
    query: GlobalModel.period
  })
