import Elysia from "elysia";
import { betterAuth } from "../../middleware/betterAuth";
import { ProductServiceModel } from "./model";
import { ProductServiceService } from "./service";
import { GlobalModel } from "../../model/global.model";

export const productService = new Elysia({ prefix: "/productService" })
  .use(betterAuth)
  .post(
    "/",
    async ({ user, set, body }) => {
      const response = await ProductServiceService.createProductServie(
        body,
        user.id
      );
      set.status = 201;
      return response;
    },
    {
      auth: true,
      body: ProductServiceModel.productServiceBody,
      response: {
        201: ProductServiceModel.productServiceResponse,
      },
    }
  )
  .get(
    "/",
    async ({ user, set, query: { limit, page, search } }) => {
      const response = await ProductServiceService.readProductService(
        { limit, page, search },
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
    "/:productServiceID",
    async ({ user, set, params: { productServiceID } }) => {
      const response = await ProductServiceService.readProductServiceByID(
        { productServiceID },
        user.id
      );

      set.status = 200;
      return response;
    },
    {
      auth: true,
      params: ProductServiceModel.productServiceParams,
      response: {
        200: ProductServiceModel.productServiceResponse,
      },
    }
  )
  .put(
    "/:productServiceID",
    async ({ user, set, body, params: { productServiceID } }) => {
      const response = await ProductServiceService.updateProductService(
        { productServiceID },
        body,
        user.id
      );
      set.status = 200;
      return response;
    },
    {
      auth: true,
      body: ProductServiceModel.productServiceBody,
      params: ProductServiceModel.productServiceParams,
      response: {
        200: ProductServiceModel.productServiceResponse,
      },
    }
  )
  .delete(
    "/:productServiceID",
    async ({ user, set, params: { productServiceID } }) => {
      await ProductServiceService.deleteProductService(
        { productServiceID },
        user.id
      );
      set.status = 204;
      return;
    },
    {
      auth: true,
      params: ProductServiceModel.productServiceParams,
    }
  ).get('/export', async ({user,set}) => {
        const response = await ProductServiceService.getCSV(user.id)
        set.status = response?200:500
        set.headers['content-type'] = "text/csv"
        set.headers['content-disposition'] = `attachment; filename="productSerive_${Date.now()}.csv"`
        return response
    },{
      auth: true
    })
