import { Elysia } from "elysia";
import { auth } from "./utils/auth";
import cors from "@elysiajs/cors";
import { clients } from "./modules/clients";
import { openapi } from "@elysiajs/openapi";

import { OpenAPI } from "./utils/auth";
import { productService } from "./modules/products-services";
import { lineItems } from "./modules/items";
import { invoices } from "./modules/invoices";
const app = new Elysia({ prefix: "/api" })
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .mount(auth.handler)
  .use(clients)
  .use(productService)
  .use(lineItems)
  .use(invoices)
  .listen(Bun.env.PORT! || 3000);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
