const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = require('./graphql/resolvers');

const ENV = process.env.NODE_ENV || 'development';

const server = new GraphQLServer({
  typeDefs: 'src/graphql/schema.graphql',
  resolvers,
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
  playground: ENV === 'development' ? '/' : false,
};

server.start(options, ({ port }) =>
  console.log(`GraphQL server is running on http://localhost:${port}`));
