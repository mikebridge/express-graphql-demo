-- CreateTable
CREATE TABLE "Scrobble" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "artist" TEXT NOT NULL,
    "album" TEXT,
    "track" TEXT NOT NULL,
    "datecreated" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
