import { and, eq } from "drizzle-orm";
import { db } from "../../database";
import { ProductService } from "../../database/schema/schema";
import { ProductServiceModel } from "./model";
import { status } from "elysia";

export namespace ProductServiceService {
  export async function createProductServie(
    {
      description,
      isService,
      name,
      unitPrice,
    }: ProductServiceModel.productServiceBody,
    userID: string
  ) {
    const [newProductService] = await db
      .insert(ProductService)
      .values({
        isService,
        name,
        unitPrice,
        userID,
        description,
      })
      .returning();

    return newProductService;
  }

  export async function readProductService(userID: string) {
    const productServices = await db
      .select()
      .from(ProductService)
      .where(eq(ProductService.userID, userID));

    return productServices;
  }

  export async function readProductServiceByID(
    { productServiceID }: ProductServiceModel.productServiceParams,
    userID: string
  ) {
    const productServiceIDInt = Number(productServiceID);
    if (isNaN(productServiceIDInt))
      throw status(400, "Parameter should be a string or access denied.");

    const [productService] = await db
      .select()
      .from(ProductService)
      .where(
        and(
          eq(ProductService.id, productServiceIDInt),
          eq(ProductService.userID, userID)
        )
      )
      .limit(1);

    if (!productService) throw status(404, "Not Found");

    return productService;
  }

  export async function updateProductService(
    { productServiceID }: ProductServiceModel.productServiceParams,
    {
      description,
      isService,
      name,
      unitPrice,
    }: ProductServiceModel.productServiceBody,
    userID: string
  ) {
    const productServiceIDInt = Number(productServiceID);
    if (isNaN(productServiceIDInt))
      throw status(400, "Parameter should be a string or access denied.");

    const checkrow = await db.$count(
      ProductService,
      and(
        eq(ProductService.id, productServiceIDInt),
        eq(ProductService.userID, userID)
      )
    );
    if (checkrow === 0) throw status(404, "Not Found or Access denied.");

    const [updatedProductService] = await db
      .update(ProductService)
      .set({
        description,
        isService,
        name,
        unitPrice,
      })
      .where(
        and(
          eq(ProductService.id, productServiceIDInt),
          eq(ProductService.userID, userID)
        )
      )
      .returning();

    if (!updatedProductService)
      throw status(400, "Failed to retrieve updated record.");

    return updatedProductService;
  }

  export async function deleteProductService(
    { productServiceID }: ProductServiceModel.productServiceParams,
    userID: string
  ) {
    const productServiceIDInt = Number(productServiceID);
    if (isNaN(productServiceIDInt))
      throw status(400, "Parameter should be a string or access denied.");

    const [deletedID] = await db
      .delete(ProductService)
      .where(
        and(
          eq(ProductService.id, productServiceIDInt),
          eq(ProductService.userID, userID)
        )
      )
      .returning({ id: ProductService.id });
    if (!deletedID) throw status(404, "Not Found or Access denied.");

    return;
  }
}
