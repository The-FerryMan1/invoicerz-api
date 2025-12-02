CREATE TABLE "client" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "client_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"company_name" varchar(100) NOT NULL,
	"contact_person" varchar(255),
	"email" text NOT NULL,
	"phone" varchar(50),
	"address_street" varchar(255),
	"address_city" varchar(100),
	"address_zip" varchar(20),
	"address_country" varchar(100),
	CONSTRAINT "client_email_unique" UNIQUE("email")
);
