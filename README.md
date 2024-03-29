# GraphQL Demo with Last.FM Data

_(Oct 26, 2023): This demo is deprecated in favour of [this rewrite with nestjs + apollo](https://github.com/mikebridge/nestjs-scrobbled)_

`Postgresql` / `GraphQL` / `Prisma` / `Express` / `TypeScript` / `Docker`

Demo of GraphQL using personal [Last.FM](https://www.last.fm/)
data

## `Initial db setup`

```bash
docker-compose run --rm server npx prisma init
```

To modify the database, first modify the prisma.schema
file, then create a migration from it:

```bash
docker-compose run --rm server npm run prisma:migrate
docker-compose run --rm server npm run prisma:generate
```

## `Import From Last.FM`

export your LastFM list from [here](https://benjaminbenben.com/lastfm-to-csv/)

```
COPY Scrobble(artist, album, track, datecreated)
FROM last_fm_export.csv'
DELIMITER ','
CSV HEADER;
```

```sql
INSERT INTO "Artist"(name)
SELECT DISTINCT Artist
FROM    "Scrobble";

-- todo: Handle the NULL album names
INSERT INTO "Album"("artistId", Name)
SELECT DISTINCT "Artist".id AS ArtistId,
                "Scrobble".Album AS Name
FROM "Scrobble"
    JOIN "Artist" ON "Scrobble".Artist="Artist".Name;

```

```sql
INSERT INTO "Track"("albumId", name)
SELECT DISTINCT "Album".id, track FROM "Scrobble"
INNER JOIN "Album"
ON "Album".name = "Scrobble".album
INNER JOIN "Artist"
ON "Album"."artistId" = "Artist".id
AND "Scrobble".artist = "Artist".name;
```

Navigate to [http://localhost:3000/graphql](http://localhost:3000/graphql)

Try some queries like:
```graphql
  {
  	searchTracks(searchString:"Hello"){
    	name,
    	album{
        artist {
          name
        }
      }
    }
  }
```
