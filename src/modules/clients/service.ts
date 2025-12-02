import { and, eq } from "drizzle-orm";
import { db } from "../../database";
import { Clients } from "../../database/schema/schema";
import { ClientModel } from "./model";
import { status } from "elysia";

export namespace ClientService {
  export async function createClient(
    {
      addressCity,
      addressCountry,
      addressStreet,
      addressZip,
      companyName,
      contactPerson,
      email,
      phone,
    }: ClientModel.clientBody,
    userID: string
  ): Promise<ClientModel.clientBody> {
    const [newClient] = await db
      .insert(Clients)
      .values({
        userID,
        companyName,
        email,
        addressCity,
        addressCountry,
        addressStreet,
        addressZip,
        contactPerson,
        phone,
      })
      .returning();

    return newClient;
  }

  export async function readClients(
    userID: string
  ): Promise<ClientModel.clientResponse[]> {
    const clients = await db
      .select()
      .from(Clients)
      .where(eq(Clients.userID, userID));
    return clients;
  }

  export async function readClientByID(
    { clientID }: ClientModel.clientIDParam,
    userID: string
  ): Promise<ClientModel.clientResponse> {
    const clientIDInt = parseInt(clientID);

    if (isNaN(clientIDInt))
      throw status(400, "Client ID should be numeric or access denied.");

    const [client] = await db
      .select()
      .from(Clients)
      .where(and(eq(Clients.id, clientIDInt), eq(Clients.userID, userID)));
    return client;
  }

  export async function updateClient(
    { clientID }: ClientModel.clientIDParam,
    {
      addressCity,
      addressCountry,
      addressStreet,
      addressZip,
      companyName,
      contactPerson,
      email,
      phone,
    }: ClientModel.clientBody,
    userID: string
  ): Promise<ClientModel.clientResponse> {
    const clientIDInt = parseInt(clientID);

    if (isNaN(clientIDInt))
      throw status(400, "Client ID should be numeric or access denied.");

    const [updatedClient] = await db
      .update(Clients)
      .set({
        addressCity,
        addressCountry,
        addressStreet,
        addressZip,
        companyName,
        contactPerson,
        email,
        phone,
      })
      .where(and(eq(Clients.id, clientIDInt), eq(Clients.userID, userID)))
      .returning();

    return updatedClient;
  }

  export async function deleteClient(
    { clientID }: ClientModel.clientIDParam,
    userID: string
  ) {
    const clientIDInt = parseInt(clientID);

    if (isNaN(clientIDInt))
      throw status(400, "Client ID should be numeric or access denied.");

    await db
      .delete(Clients)
      .where(and(eq(Clients.id, clientIDInt), eq(Clients.userID, userID)));
  }
}
