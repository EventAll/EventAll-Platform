const logger = require('../../helpers/logger');
const { SALT_ROUNDS } = require('../../helpers/constants');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AuthError } = require('../../helpers/errors');

module.exports = {
  Mutation: {
    createAccount: async (_, args, context, info) => {
      // Email and password are the only required fields
      let user;
      if (!args.facebookId) {
        // Check if account with email already exists.
        if (await context.prisma.exists.User({ email: args.email })) {
          throw new AuthError(
            `Cannot create user with email ${
              args.email
            }, such an email already exists`
          );
        }

        const password = await bcrypt.hash(args.password, SALT_ROUNDS);
        user = await context.prisma.mutation.createUser({
          data: {
            name: args.name,
            email: args.email,
            gender: args.gender,
            password,
            facebookId: '',
          },
        });

        return {
          token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
          user,
        };
      }
      user = {
        name: args.name,
        email: args.email,
        gender: args.gender,
        // TODO: implement FB auth later
        password: '????',
        facebookId: Math.random().toString(),
      };
      return context.prisma.mutation.createUser(
        {
          data: user,
        },
        info
      );
    },
    login: async (_, args, context, info) => {
      const { email, password } = args;
      if (!email || !password) {
        throw new Error('Email and password must be specified');
      }
      const user = await context.prisma.query.user({ where: { email } }, info);
      if (!user) {
        throw new AuthError('User does not exist');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AuthError('Invalid password');
      }
      return {
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
        user,
      };
    },
    signUpForEvent: async (_, args, context, info) => {
      const { userId, eventId } = args;
      const userExists = await context.prisma.exists.User({ id: userId });
      if (!userExists) {
        const errorMsg = `User does not exist with id ${userId}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }
      const eventExists = await context.prisma.exists.Event({ id: eventId });
      if (!eventExists) {
        const errorMsg = `Event does not exist with id ${eventId}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }

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
    user: async (_, args, context, info) => {
      const user = await context.prisma.query.user(
        {
          where: {
            id: args.id,
          },
        },
        info
      );
      return user;
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
