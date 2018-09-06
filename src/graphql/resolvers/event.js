const logger = require('../../helpers/logger');

module.exports = {
  Query: {
    events: (_, args, context, info) => {
      let query = null;
      const { searchString } = args;
      if (searchString) {
        query = {
          where: {
            OR: [
              { name_contains: args.searchString },
              { location_contains: args.searchString },
              { description_contains: args.searchString },
            ],
          },
        };
      }
      return context.prisma.query.events(query, info);
    },
  },
  Mutation: {
    createEvent: (_, args, context, info) => {
      const startDateUtc = new Date(args.startDateUtc);
      const endDateUtc = new Date(args.endDateUtc);
      if (startDateUtc >= endDateUtc) {
        const errorMsg = `Start Date UTC (${startDateUtc}) >= End Date UTC ${endDateUtc}`;
        logger.error(errorMsg);
        // Later move to apollo-error?
        throw new Error(errorMsg);
      }

      // const event = {
      //   name: args.name,
      //   location: args.location,
      //   description: args.description || '',
      //   isAllDay: args.isAllDay,
      //   isRecurring: args.isRecurring,
      //   duration: args.duration,
      //   recurrencePattern: args.recurrencePattern,
      //   startDateUtc: args.startDateUtc,
      //   endDateUtc: args.endDateUtc,
      // };
      return context.prisma.mutation.createEvent(
        {
          data: args,
        },
        info
      );
    },
  },
};
