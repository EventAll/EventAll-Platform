const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
const logger = require('./helpers/logger');

const ENV = process.env.NODE_ENV || 'development';

const server = new GraphQLServer({
  typeDefs: 'src/graphql/schema.graphql',
  resolvers: require('./graphql/resolvers'),
  context: (req) => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/graphql/generated/prisma.graphql',
      endpoint: 'http://localhost:4466',
    }),
  }),
});

const options = {
  port: 4000,
  // Only enable graphql playground in development mode
  playground: ENV === 'development' ? '/playground' : false,
};

server.express.use(require('./routes/healthcheck'));

server.start(options, ({ port }) =>
  logger.verbose(`GraphQL server is running on http://localhost:${port}`));