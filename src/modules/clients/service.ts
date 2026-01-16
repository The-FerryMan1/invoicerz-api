import { and, count, desc, eq, gt, gte, ilike, like, lt, lte, or, sql, SQL } from "drizzle-orm";
import { db } from "../../database";
import { Clients } from "../../database/schema/schema";
import { ClientModel } from "./model";
import { status } from "elysia";
import { GlobalModel } from "../../model/global.model";
import { csvExporter } from "../../utils/csvExported";
import { periodFilter } from "../../utils/periodFilter";

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
    const emailCheck = await db.$count(Clients, eq(Clients.email, email));
    if (emailCheck !== 0) throw status(400, "Email already exist.");

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
    { page, limit, search }: GlobalModel.paginationQuery,
    userID: string
  ) {
    const offset = (Number(page) - 1) * Number(limit);

    const searchFilter: SQL[] = []


    if (search) {
      const items = `%${String(search)}%`
      searchFilter.push(

        ilike(Clients.companyName, items),
        ilike(Clients.email, items),
        ilike(Clients.addressCity, items),
        ilike(Clients.addressCountry, items),
        ilike(Clients.addressStreet, items),
        ilike(Clients.addressZip, items),
        ilike(Clients.contactPerson, items),
        ilike(Clients.phone, items),
      )
    }

    const clients = await db
      .select()
      .from(Clients)
      .where(and(eq(Clients.userID, userID), or(...searchFilter)))
      .orderBy(desc(Clients.createdAt))
      .offset(offset)
      .limit(Number(limit));

    const totalClient = await db.$count(Clients, eq(Clients.userID, userID));

    const totalPages = Math.ceil(totalClient / Number(limit)) || 0;

    const pagination: GlobalModel.pagination = {
      record: clients,
      meta: {
        currentPage: Number(page),
        limit: Number(limit),
        recordsOnPage: clients.length,
        totalPages,
        totalRecord: totalClient,
      },
    };

    return pagination;
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

    if (!client) throw status(404, "Not Found or Access denied.");
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
        updatedAt: new Date(Date.now()),
      })
      .where(and(eq(Clients.id, clientIDInt), eq(Clients.userID, userID)))
      .returning();

    if (!updatedClient) throw status(404, "Not Found or Access denied");

    return updatedClient;
  }

  export async function deleteClient(
    { clientID }: ClientModel.clientIDParam,
    userID: string
  ) {
    const clientIDInt = parseInt(clientID);

    if (isNaN(clientIDInt))
      throw status(400, "Client ID should be numeric or access denied.");

    const [deletedClientID] = await db
      .delete(Clients)
      .where(and(eq(Clients.id, clientIDInt), eq(Clients.userID, userID)))
      .returning({ id: Clients.id });

    if (!deletedClientID) throw status(404, "Not Found");

    return;
  }

  export async function getCSV(userID: string) {

    const client = await db.select().from(Clients).where(eq(Clients.userID, userID))


    const csv = await csvExporter<typeof client[0]>(client, 'clients')

    return csv
  }

  export async function calculateClient(userID: string, { period }: GlobalModel.period) {

    let periodSqlFilter:SQL[] = []
    if(period !== GlobalModel.filterType.all){
      const { startDate, endDate } = periodFilter({ period })
      periodSqlFilter.push(
        gte(Clients.createdAt, new Date(startDate.toISOString())),
        lte(Clients.createdAt, new Date(endDate.toISOString()))
      )
    }
    const [client] = await db
    .select({clientCount:count()})
    .from(Clients)
    .where(
      and(
        eq(Clients.userID, userID), 
        ...periodSqlFilter
      )
    )
    return client
  }
}
