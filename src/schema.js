const {
  intArg,
  makeSchema,
  nonNull,
  objectType,
  stringArg,
  inputObjectType,
  arg,
  asNexusMethod,
  enumType,
} = require('nexus')
const { DateTimeResolver } = require('graphql-scalars')

const DateTime = asNexusMethod(DateTimeResolver, 'date')

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('allCategories', {
      type: 'Categories',
      resolve: (_parent, _args, context) => {
        return context.prisma.categories.findMany()
      },
    })

    t.nonNull.list.nonNull.field('allFavorites', {
      type: 'Favorites',
      resolve: (_parent, _args, context) => {
        return context.prisma.favorites.findMany()
      },
    })

    t.nullable.field('favoritesById', {
      type: 'Favorites',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.favorites.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    t.nullable.field('categoriesById', {
      type: 'Categories',
      args: {
        id: intArg(),
      },
      resolve: (_parent, args, context) => {
        return context.prisma.categories.findUnique({
          where: { id: args.id || undefined },
        })
      },
    })

    // t.nonNull.list.nonNull.field('feed', {
    //   type: 'Post',
    //   args: {
    //     searchString: stringArg(),
    //     skip: intArg(),
    //     take: intArg(),
    //     orderBy: arg({
    //       type: 'PostOrderByUpdatedAtInput',
    //     }),
    //   },
    //   resolve: (_parent, args, context) => {
    //     const or = args.searchString
    //       ? {
    //         OR: [
    //           { title: { contains: args.searchString } },
    //           { content: { contains: args.searchString } },
    //         ],
    //       }
    //       : {}

    //     return context.prisma.post.findMany({
    //       where: {
    //         published: true,
    //         ...or,
    //       },
    //       take: args.take || undefined,
    //       skip: args.skip || undefined,
    //       orderBy: args.orderBy || undefined,
    //     })
    //   },
    // })

    // t.list.field('draftsByUser', {
    //   type: 'Post',
    //   args: {
    //     userUniqueInput: nonNull(
    //       arg({
    //         type: 'UserUniqueInput',
    //       }),
    //     ),
    //   },
    //   resolve: (_parent, args, context) => {
    //     return context.prisma.user
    //       .findUnique({
    //         where: {
    //           id: args.userUniqueInput.id || undefined,
    //           email: args.userUniqueInput.email || undefined,
    //         },
    //       })
    //       .posts({
    //         where: {
    //           published: false,
    //         },
    //       })
    //   },
    // })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // t.nonNull.field('signupUser', {
    //   type: 'User',
    //   args: {
    //     data: nonNull(
    //       arg({
    //         type: 'UserCreateInput',
    //       }),
    //     ),
    //   },
    //   resolve: (_, args, context) => {
    //     const postData = args.data.posts
    //       ? args.data.posts.map((post) => {
    //         return { title: post.title, content: post.content || undefined }
    //       })
    //       : []
    //     return context.prisma.user.create({
    //       data: {
    //         name: args.data.name,
    //         email: args.data.email,
    //         posts: {
    //           create: postData,
    //         },
    //       },
    //     })
    //   },
    // })

    t.field('createFavorites', {
      type: 'Favorites',
      args: {
        data: nonNull(
          arg({
            type: 'FavoritesCreateInput',
          }),
        ),
        categoryID: nonNull(intArg()),
      },
      resolve: (_, args, context) => {
        return context.prisma.favorites.create({
          data: {
            name: args.data.name,
            shipID: args.data.shipID,
            manufacturer: args.data.manufacturer,
            storeImage: args.data.storeImage,
            storeURL: args.data.storeURL,
            brochure: args.data.brochure,
            description: args.data.description,
            favorites: {
              connect: { categoryID: args.categoryID },
            },
          },
        })
      },
    })

    // t.field('togglePublishPost', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: async (_, args, context) => {
    //     const post = await context.prisma.post.findUnique({
    //       where: { id: args.id || undefined },
    //       select: {
    //         published: true,
    //       },
    //     })

    //     if (!post) {
    //       throw new Error(
    //         `Post with ID ${args.id} does not exist in the database.`,
    //       )
    //     }

    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: { published: !post.published },
    //     })
    //   },
    // })

    // t.field('incrementPostViewCount', {
    //   type: 'Post',
    //   args: {
    //     id: nonNull(intArg()),
    //   },
    //   resolve: (_, args, context) => {
    //     return context.prisma.post.update({
    //       where: { id: args.id || undefined },
    //       data: {
    //         viewCount: {
    //           increment: 1,
    //         },
    //       },
    //     })
    //   },
    // })

//     t.field('deletePost', {
//       type: 'Post',
//       args: {
//         id: nonNull(intArg()),
//       },
//       resolve: (_, args, context) => {
//         return context.prisma.post.delete({
//           where: { id: args.id },
//         })
//       },
//     })
//   },
// })

const Categories = objectType({
  name: 'Categories',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.string('name')
    t.int('maxSize')
    t.nonNull.list.nonNull.field('favorites', {
      type: 'Favorites',
      resolve: (parent, _, context) => {
        return context.prisma.categories
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .favorites()
      },
    })
  },
})

const Favorites = objectType({
  name: 'Favorites',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.field('updatedAt', { type: 'DateTime' })
    t.nonNull.string('name')
    t.nonNull.string('shipID')
    t.nonNull.string('manufacturer')
    t.nonNull.string('storeImage')
    t.nonNull.string('storeURL')
    t.nonNull.string('brochure')
    t.nonNull.string('description')
    t.field('category', {
      type: 'Categories',
      resolve: (parent, _, context) => {
        return context.prisma.favorites
          .findUnique({
            where: { id: parent.id || undefined },
          })
          .categories()
      },
    })
  },
})

// const SortOrder = enumType({
//   name: 'SortOrder',
//   members: ['asc', 'desc'],
// })

// const PostOrderByUpdatedAtInput = inputObjectType({
//   name: 'PostOrderByUpdatedAtInput',
//   definition(t) {
//     t.nonNull.field('updatedAt', { type: 'SortOrder' })
//   },
// })

// const UserUniqueInput = inputObjectType({
//   name: 'UserUniqueInput',
//   definition(t) {
//     t.int('id')
//     t.string('email')
//   },
// })

const FavoritesCreateInput = inputObjectType({
  name: 'FavoritesCreateInput',
  definition(t) {
    t.nonNull.string('name')
    t.nonNull.string('shipID')
    t.nonNull.string('manufacturer')
    t.nonNull.string('storeImage')
    t.nonNull.string('storeURL')
    t.nonNull.string('brochure')
    t.nonNull.string('description')
  },
})

// const UserCreateInput = inputObjectType({
//   name: 'UserCreateInput',
//   definition(t) {
//     t.nonNull.string('email')
//     t.string('name')
//     t.list.nonNull.field('posts', { type: 'PostCreateInput' })
//   },
// })

const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Favorites,
    Categories,
    // UserUniqueInput,
    // UserCreateInput,
    FavoritesCreateInput,
    // SortOrder,
    // PostOrderByUpdatedAtInput,
    DateTime,
  ],
  outputs: {
    schema: __dirname + '/../schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
})

module.exports = {
  schema: schema,
}
