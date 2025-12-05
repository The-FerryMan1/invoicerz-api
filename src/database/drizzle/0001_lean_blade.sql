ALTER TABLE "client" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "client" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "invoice" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "lineitems" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "lineitems" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "productservice" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "productservice" ADD COLUMN "updated_at" timestamp;