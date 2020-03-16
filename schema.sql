DROP TABLE IF EXISTS "userProfiles";

CREATE TABLE "userProfiles" (
	"userId" SERIAL CONSTRAINT "unique_userId" UNIQUE,
	"profileId" SERIAL CONSTRAINT "unique_profileId" UNIQUE,
	"fullName" TEXT CONSTRAINT "unique_fullName" UNIQUE NOT NULL,
	"screenName" TEXT CONSTRAINT "unique_screenName" UNIQUE NOT NULL,
	"email" TEXT CONSTRAINT "unique_email" UNIQUE NOT NULL,
	"location" TEXT NOT NULL,
	"phone" VARCHAR(25) NOT NULL,
	"profileImage" BYTEA,
	"favoriteGenres" TEXT,
	"createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
	PRIMARY KEY ("userId", "profileId")
);

DROP TABLE IF EXISTS "posts";

CREATE TABLE "posts" (
	"postId" SERIAL CONSTRAINT "unique_postId" UNIQUE,
	"userId" INTEGER,
	"subject" TEXT NOT NULL,
	"content" TEXT NOT NULL,
	"datePosted" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
	PRIMARY KEY ("postId"),
	CONSTRAINT "fk_userId_posts"
	FOREIGN KEY ("userId") REFERENCES "userProfiles" ("userId") ON DELETE RESTRICT
);