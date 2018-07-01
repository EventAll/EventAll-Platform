const { readdirSync } = require('fs');

const resolvers = {
  Query: {},
  Mutation: {},
};

readdirSync(`${__dirname}/`).forEach((file) => {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    const resolver = require('./' + file);
    const { Query, Mutation } = resolver;
    // Read all of the Query objects into the dictionary
    if (Query) {
      for (const [key, value] of Object.entries(Query)) {
        if (resolvers.Query[key] !== undefined) {
          throw new Error(`Query with key ${key} alraedy exists`);
        }
        resolvers.Query[key] = value;
      }
    }
    // Read all of the mutation objects into the dictionary
    if (Mutation) {
      for (const [key, value] of Object.entries(Mutation)) {
        if (resolvers.Query[key] !== undefined) {
          throw new Error(`Mutation with key ${key} alraedy exists`);
        }
        resolvers.Mutation[key] = value;
      }
    }
  }
});

module.exports = resolvers;
