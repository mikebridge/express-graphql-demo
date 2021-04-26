-- CreateTable
CREATE TABLE "Track" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v1(),
    "albumId" UUID NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Track" ADD FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
