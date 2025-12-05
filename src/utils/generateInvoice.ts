import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import * as path from "node:path";
import { InvoicesModel } from "../modules/invoices/model";
import { ItemsModel } from "../modules/items/model";
import { invoices } from "../modules/invoices";

interface Data {
  invoices: Object;
  items: ItemsModel.itemsResponse[];
}
export async function generateInvoicePDF(data: Data) {
  const templatePath = path.join(
    import.meta.dir,
    "..",
    "template",
    "invoice.handlebars"
  );
  const templateHTML = await Bun.file(templatePath).text();

  const template = Handlebars.compile(templateHTML);
  const finalHTML = template(data);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
    });

    return pdfBuffer;
  } catch (error) {
    console.log(error, "failed to generate pdf");
  } finally {
    await browser.close();
  }
}
