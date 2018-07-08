const logger = require('../../helpers/logger');

module.exports = {
  Mutation: {
    createAccount: (_, args, context, info) => {
      const user = {
        name: args.name,
        email: args.email,
        gender: args.gender,
      };
      return context.prisma.mutation.createUser(
        {
          data: user,
        },
        info
      );
    },
    signUpForEvent: (_, args, context, info) => {
      const { id, eventId } = args;
      const user = context.prisma.query.user(
        {
          where: {
            id,
          },
        },
        info
      );
      logger.info(user);
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
      return context.prisma.query.users();
    },
  },
};
