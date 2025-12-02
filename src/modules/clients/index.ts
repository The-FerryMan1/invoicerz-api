import Elysia from "elysia";
import { betterAuth } from "../../middleware/betterAuth";
import { ClientModel } from "./model";
import { ClientService } from "./service";
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
    async ({ user, set }) => {
      const response = await ClientService.readClients(user.id);
      set.status = 200;
      return response;
    },
    {
      auth: true,
      response: {
        200: ClientModel.clientResponseArray,
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
