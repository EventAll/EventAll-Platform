module.exports = {
  Query: {
    events: (_, args, context, info) => {
      return context.prisma.query.events(
        {
          where: {
            OR: [
              { name_contains: args.searchString },
              { location_contains: args.searchString },
              { description_contains: args.searchString },
            ],
          },
        },
        info
      );
    },
  },
  Mutation: {},
};
