import { makeExecutableSchema } from '@graphql-tools/schema';
//import { DateTimeResolver } from 'graphql-scalars';n
//import { Context } from './context';
import { PrismaClient } from '@prisma/client';
import { Context } from './context';
import { DateTimeResolver } from 'graphql-scalars';

const typeDefs = `
  type Artist {
    id: String,
    name: String,
    albums: [Album!]!
  }
  type Album {
    id: String,
    name: String,
    artistId: String,
    artist: Artist!
    tracks: [Track!]!
  }
  type Track {
    id: String,
    album: Album!,
    albumId: String,
    name: String
  }
  type Query {
    allArtists: [Artist!]!
    allAlbums: [Album!]!
    allTracks: [Track!]!
    searchTracks(searchString: String, skip: Int, take: Int): [Track!]!
  }
  enum SortOrder {
    asc
    desc
  }
  scalar DateTime
`;

// const typeDefs = `
// type Mutation {
//   createDraft(authorEmail: String!, data: PostCreateInput!): Post
//   deletePost(id: Int!): Post
//   incrementPostViewCount(id: Int!): Post
//   signupUser(data: UserCreateInput!): User!
//   togglePublishPost(id: Int!): Post
// }
//
// type Post {
//   author: User
//   content: String
//   createdAt: DateTime!
//   id: Int!
//   published: Boolean!
//   title: String!
//   updatedAt: DateTime!
//   viewCount: Int!
// }
//
// input PostCreateInput {
//   content: String
//   title: String!
// }
//
// input PostOrderByUpdatedAtInput {
//   updatedAt: SortOrder!
// }
//
// type Query {
//   allUsers: [User!]!
//   draftsByUser(userUniqueInput: UserUniqueInput!): [Post]
//   feed(orderBy: PostOrderByUpdatedAtInput, searchString: String, skip: Int, take: Int): [Post!]!
//   postById(id: Int): Post
// }
//
// enum SortOrder {
//   asc
//   desc
// }
//
// type User {
//   email: String!
//   id: Int!
//   name: String
//   posts: [Post!]!
// }
//
// input UserCreateInput {
//   email: String!
//   name: String
//   posts: [PostCreateInput!]
// }
//
// input UserUniqueInput {
//   email: String
//   id: Int
// }
//
// scalar DateTime
// `

const resolvers = {
  Query: {
    allArtists: (_parent, _args, context: Context) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.artist.findMany();
    },
    allAlbums: (_parent, _args, context: Context) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.album.findMany();
    },
    allTracks: (_parent, _args, context: Context) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.track.findMany();
    },
    // postById: (_parent, args: { id: number }, context: Context) => {
    //   return context.prisma.post.findUnique({
    //     where: { id: args.id || undefined }
    //   })
    // },
    searchTracks(
      _parent,
      args: {
        searchString: string;
        skip: number;
        take: number;
      },
      context: Context
    ) {
      return context.prisma.track.findMany({
        where: {
          ...(args.searchString ? { name: { contains: args.searchString } } : {})
        },
        take: args?.take,
        skip: args?.skip
        // orderBy: args?.orderBy
      });
    }
    //
    //   return context.prisma.post.findMany({
    //     where: {
    //       published: true,
    //       ...or
    //     },
    //     take: args?.take,
    //     skip: args?.skip,
    //     orderBy: args?.orderBy
    //   })
    // },
    // draftsByUser: (_parent, args: { userUniqueInput: UserUniqueInput }, context: Context) => {
    //   return context.prisma.user.findUnique({
    //     where: {
    //       id: args.userUniqueInput.id || undefined,
    //       email: args.userUniqueInput.email || undefined,
    //     },
    //   }).posts({
    //     where: {
    //       published: false
    //     },
    //   })
    // }
  },
  // Mutation: {
  //   signupUser: (_parent, args: { data: UserCreateInput }, context: Context) => {
  //     const postData = args.data.posts?.map(post => {
  //       return { title: post.title, content: post.content || undefined }
  //     })
  //
  //     return context.prisma.user.create({
  //       data: {
  //         name: args.data.name,
  //         email: args.data.email,
  //         posts: {
  //           create: postData
  //         }
  //       },
  //     })
  //   },
  //   createDraft: (_parent, args: { data: PostCreateInput, authorEmail: string }, context: Context) => {
  //     return context.prisma.post.create({
  //       data: {
  //         title: args.data.title,
  //         content: args.data.content,
  //         author: {
  //           connect: { email: args.authorEmail },
  //         },
  //       },
  //     })
  //   },
  //   togglePublishPost: async (_parent, args: { id: number }, context: Context) => {
  //     try {
  //       const post = await context.prisma.post.findUnique({
  //         where: { id: args.id || undefined },
  //         select: {
  //           published: true
  //         }
  //       })
  //
  //       return context.prisma.post.update({
  //         where: { id: args.id || undefined },
  //         data: { published: !post?.published },
  //       })
  //     } catch (error) {
  //       throw new Error(
  //         `Post with ID ${args.id} does not exist in the database.`,
  //       )
  //     }
  //   },
  //   incrementPostViewCount: (_parent, args: { id: number }, context: Context) => {
  //     return context.prisma.post.update({
  //       where: { id: args.id || undefined },
  //       data: {
  //         viewCount: {
  //           increment: 1
  //         }
  //       },
  //     })
  //   },
  //   deletePost: (_parent, args: { id: number }, context: Context) => {
  //     return context.prisma.post.delete({
  //       where: { id: args.id },
  //     })
  //   }
  // },
  DateTime: DateTimeResolver,
  Artist: {
    albums: (parent, _args, context: Context) => {
      return context.prisma.artist
        .findUnique({
          where: { id: parent?.id }
        })
        .albums();
    }
  },
  Album: {
    artist: (parent, _args, context: Context) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.album
        .findUnique({
          where: { id: parent?.id }
        })
        .artist();
    },
    tracks: (parent, _args, context: Context) => {
      const result = context.prisma.album.findUnique({
        where: { id: parent?.id }
      });
      return result.tracks();
    }
  },
  Track: {
    album: (parent, _args, context: Context) => {
      const prisma: PrismaClient = context.prisma;
      return prisma.track
        .findUnique({
          where: { id: parent?.id }
        })
        .album();
    }
  }
};

// enum SortOrder {
//   asc = "asc",
//   desc = "desc"
// }
//
// interface PostOrderByUpdatedAtInput {
//   updatedAt: SortOrder
// }
//
// interface UserUniqueInput {
//   id?: number,
//   email?: string
// }
//
// interface PostCreateInput {
//   title: string,
//   content?: string,
// }
//
// interface UserCreateInput {
//   email: string,
//   name?: string,
//   posts?: PostCreateInput[],
// }

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs
});
