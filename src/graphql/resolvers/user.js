const logger = require('../../helpers/logger');

module.exports = {
  Mutation: {
    createAccount: (_, args, context, info) => {
      const user = {
        name: args.name,
        email: args.email,
        gender: args.gender,
        // TODO: change this facebookID later
        facebookId: Math.random().toString(),
      };
      return context.prisma.mutation.createUser(
        {
          data: user,
        },
        info
      );
    },
    signUpForEvent: async (_, args, context, info) => {
      const { userId, eventId } = args;
      await context.prisma.mutation.updateUser(
        {
          where: {
            id: userId,
          },
          data: {
            events: {
              connect: [{ id: eventId }],
            },
          },
        },
        info
      );
      return await context.prisma.mutation.updateEvent(
        {
          where: {
            id: eventId,
          },
          data: {
            attendees: {
              connect: [{ id: userId }],
            },
          },
        },
        info
      );
    },
  },
  Query: {
    user: (_, args, context, info) => {
      return context.prisma.query.user(
        {
          where: {
            id: args.id,
          },
        },
        info
      );
    },
    // NOTE: DELETE THIS FOR PRODUCTION
    users: (_, args, context, info) => {
      let query = null;
      const { searchString } = args;
      if (searchString) {
        query = {
          where: {
            OR: [
              { name_contains: searchString },
              { email_contains: searchString },
            ],
          },
        };
      }
      return context.prisma.query.users(query, info);
    },
  },
};
