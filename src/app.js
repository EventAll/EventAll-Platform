const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
require('dotenv').config();
const logger = require('./helpers/logger');

const ENV = process.env.NODE_ENV || 'development';

const server = new GraphQLServer({
  typeDefs: 'src/graphql/schema.graphql',
  resolvers: require('./graphql/resolvers'),
  context: (req) => ({
    ...req,
    prisma: new Prisma({
      typeDefs: 'src/graphql/generated/prisma.graphql',
      endpoint: process.env.PRISMA_ENDPOINT,
      secret: process.env.PRISMA_SECRET,
      debug: ENV === 'development',
    }),
  }),
});

const options = {
  port: 4000,
  // Only enable graphql playground in development mode
  playground: ENV === 'development' ? '/playground' : false,
  debug: ENV === 'development',
};

server.express.use(require('./routes/healthcheck'));

server.start(options, ({ port }) =>
  logger.verbose(`GraphQL server is running on http://localhost:${port}`));
