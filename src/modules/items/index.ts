import Elysia from "elysia";
import { betterAuth } from "../../middleware/betterAuth";
import { ItemsModel } from "./model";
import { ItemsService } from "./service";
import { GlobalModel } from "../../model/global.model";

export const lineItems = new Elysia({ prefix: "lineItems" })
  .use(betterAuth)
  .post(
    "/",
    async ({ user, set, body }) => {
      const response = await ItemsService.createLineItem(body, user.id);
      set.status = 201;
      return response;
    },
    {
      auth: true,
      body: ItemsModel.itemsBody,
      response: {
        201: ItemsModel.itemsResponse,
      },
    }
  )
  .get(
    "/",
    async ({ user, set, query: { limit, page } }) => {
      const response = await ItemsService.readLineItems(
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
    "/:lineItemID",
    async ({ user, set, params: { lineItemID } }) => {
      const response = await ItemsService.readLineItemByID(
        { lineItemID },
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: ItemsModel.itemsParams,
      response: {
        200: ItemsModel.itemsResponse,
      },
    }
  )
  .put(
    "/:lineItemID",
    async ({ user, set, body, params: { lineItemID } }) => {
      const response = await ItemsService.updateLineItem(
        { lineItemID },
        body,
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: ItemsModel.itemsParams,
      body: ItemsModel.itemsBody,
      response: {
        200: ItemsModel.itemsResponse,
      },
    }
  )
  .delete(
    "/:lineItemID",
    async ({ user, set, params: { lineItemID } }) => {
      await ItemsService.deleteLineItem({ lineItemID }, user.id);
      set.status = 204;
      return;
    },
    {
      auth: true,
      params: ItemsModel.itemsParams,
    }
  ).get('/export', async ({user,set}) => {
          const response = await ItemsService.getCSV(user.id)
          set.status = response?200:500
          set.headers['content-type'] = "text/csv"
          set.headers['content-disposition'] = `attachment; filename="lineItems${Date.now()}.csv"`
          return response
      },{
        auth: true
      })
