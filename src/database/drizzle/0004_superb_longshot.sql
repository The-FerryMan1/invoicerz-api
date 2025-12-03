CREATE TYPE "public"."invoice_status" AS ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Canceled');--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"issue_date" date DEFAULT now() NOT NULL,
	"due_date" date NOT NULL,
	"status" "invoice_status" DEFAULT 'Draft' NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"tax_rate" numeric(5, 2) NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"notes" text,
	CONSTRAINT "invoice_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "lineitems" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lineitems_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"invoice_id" integer NOT NULL,
	"productservice_id" integer NOT NULL,
	"description" text NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	"line_total" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "productservice" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "productservice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"unit_price" numeric(10, 2) NOT NULL,
	"is_service" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."client"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice" ADD CONSTRAINT "invoice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineitems" ADD CONSTRAINT "lineitems_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineitems" ADD CONSTRAINT "lineitems_invoice_id_invoice_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineitems" ADD CONSTRAINT "lineitems_productservice_id_productservice_id_fk" FOREIGN KEY ("productservice_id") REFERENCES "public"."productservice"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "productservice" ADD CONSTRAINT "productservice_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;