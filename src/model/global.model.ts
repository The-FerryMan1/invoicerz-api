import { t } from "elysia";

export namespace GlobalModel {
  export const paginationQuery = t.Object({
    page: t.String({ default: "1" }),
    search: t.Optional(t.String()),
    limit: t.String({ default: "10" }),
  });

  export type paginationQuery = typeof paginationQuery.static;

  export const paginationMeta = t.Object({
    limit: t.Number(),
    currentPage: t.Number(),
    totalRecord: t.Number(),
    totalPages: t.Number(),
    recordsOnPage: t.Number(),
  });

  export type paginationMeta = typeof paginationMeta.static;

  export const pagination = t.Object({
    record: t.Array(t.Any()),
    meta: paginationMeta,
  });

  export type pagination = typeof pagination.static;


  export enum filterType{ 
    daily = 'daily',
    weekly = 'weekly',
    monthly ='monthly',
    all = 'all',
    custom = 'custom'
  }  
  export const period = t.Object({
    period: t.Enum(filterType)
  }) 
 

  export type period = typeof period.static;
}

