DROP TABLE IF EXISTS "chat";
DROP TABLE IF EXISTS "posts";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
	"userId" SERIAL,
	"name" TEXT CONSTRAINT "unique_name" UNIQUE,
	"password" TEXT,
	"username" TEXT CONSTRAINT "unique_username" UNIQUE,
	"email" TEXT CONSTRAINT "unique_email" UNIQUE,
	"zipcode" INTEGER,
	"phone" TEXT,
	"profileImage" TEXT,
	"genre1" TEXT,
	"genre2" TEXT,
	"genre3" TEXT,
	"createdAt" TIMESTAMP DEFAULT NOW(),
	"updatedAt" TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY ("userId")
);

CREATE TABLE "posts" (
	"postId" SERIAL,
	"userId" INTEGER,
	"subject" TEXT,
	"content" TEXT,
	"datePosted" TIMESTAMP DEFAULT NOW(),
	"dateUpdated" TIMESTAMP DEFAULT NOW(),
	PRIMARY KEY ("postId"),
	CONSTRAINT "fk_userId_posts" FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);

CREATE TABLE "chat" (
	"chatId" SERIAL,
	"userId" INTEGER,
	"username" TEXT,
	"message" TEXT,
	"timeSent" TEXT,
	PRIMARY KEY ("chatId"),
	CONSTRAINT "fk_userId_chat" FOREIGN KEY ("userId") REFERENCES "users" ("userId"),
	CONSTRAINT "fk_username_chat" FOREIGN KEY ("username") REFERENCES "users" ("username")
);