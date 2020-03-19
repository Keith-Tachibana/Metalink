DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
	"userId" SERIAL,
	"name" TEXT CONSTRAINT "unique_name" UNIQUE,
	"username" TEXT CONSTRAINT "unique_username" UNIQUE,
	"email" TEXT CONSTRAINT "unique_email" UNIQUE,
	"location" INTEGER,
	"phone" TEXT,
	"profileImage" TEXT,
	"genre1" TEXT,
	"genre2" TEXT,
	"genre3" TEXT,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY ("userId")
);

DROP TABLE IF EXISTS "posts";

CREATE TABLE "posts" (
	"postId" SERIAL,
	"userId" INTEGER,
	"subject" TEXT NOT NULL,
	"content" TEXT NOT NULL,
	"datePosted" TIMESTAMP NOT NULL DEFAULT NOW(),
	"dateDeleted" TIMESTAMP NOT NULL DEFAULT NOW(),
	"dateUpdated" TIMESTAMP NOT NULL DEFAULT NOW(),
	PRIMARY KEY ("postId"),
	CONSTRAINT "fk_userId_posts"
	FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);
