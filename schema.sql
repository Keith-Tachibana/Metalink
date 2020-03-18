DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
	"userId" SERIAL,
	"fullName" TEXT CONSTRAINT "unique_fullName" UNIQUE NOT NULL,
	"screenName" TEXT CONSTRAINT "unique_screenName" UNIQUE NOT NULL,
	"email" TEXT CONSTRAINT "unique_email" UNIQUE NOT NULL,
	"location" TEXT NOT NULL,
	"phone" TEXT,
	"profileImage" TEXT,
	"favoriteGenres" TEXT,
	"createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
	"updatedAt" TIMESTAMPTZ(6),
	PRIMARY KEY ("userId", "profileId")
);

DROP TABLE IF EXISTS "posts";

CREATE TABLE "posts" (
	"postId" SERIAL,
	"userId" INTEGER,
	"subject" TEXT NOT NULL,
	"content" TEXT NOT NULL,
	"datePosted" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
	"dateDeleted" TIMESTAMPTZ(6),
	"dateUpdated" TIMESTAMPTZ(6),
	PRIMARY KEY ("postId"),
	CONSTRAINT "fk_userId_posts"
	FOREIGN KEY ("userId") REFERENCES "users" ("userId")
);

