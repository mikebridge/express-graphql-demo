-- CreateTable
CREATE TABLE "Album" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "artistId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Album" ADD FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
