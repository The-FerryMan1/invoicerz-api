import Elysia from "elysia";
import { betterAuth } from "../../middleware/betterAuth";
import { ClientModel } from "./model";
import { ClientService } from "./service";
import { GlobalModel } from "../../model/global.model";
export const clients = new Elysia({ prefix: "clients" })
  .use(betterAuth)
  .post(
    "/",
    async ({ user, set, body }) => {
      const response = await ClientService.createClient(body, user.id);
      set.status = 201;
      return response;
    },
    {
      auth: true,
      body: ClientModel.clientBody,
      response: {
        201: ClientModel.clientResponse,
      },
    }
  )
  .get(
    "/",
    async ({ user, set, query: { limit, page } }) => {
      const response = await ClientService.readClients(
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
    "/:clientID",
    async ({ user, set, params: { clientID } }) => {
      const response = await ClientService.readClientByID(
        { clientID },
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: ClientModel.clientIDParam,
      response: {
        200: ClientModel.clientResponse,
      },
    }
  )
  .put(
    "/:clientID",
    async ({ user, set, body, params: { clientID } }) => {
      const response = await ClientService.updateClient(
        { clientID },
        body,
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: ClientModel.clientIDParam,
      body: ClientModel.clientBody,
      response: {
        200: ClientModel.clientResponse,
      },
    }
  )
  .delete(
    "/:clientID",
    async ({ user, set, params: { clientID } }) => {
      const response = await ClientService.deleteClient({ clientID }, user.id);
      set.status = 204;
      return;
    },
    {
      auth: true,
      params: ClientModel.clientIDParam,
    }
  );
