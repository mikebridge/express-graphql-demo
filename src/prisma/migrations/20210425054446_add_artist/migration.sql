-- CreateTable
CREATE TABLE "Artist" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
