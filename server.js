const { ApolloServer, PubSub } = require('apollo-server');
const dbConnection = require('./db');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

dbConnection();

server.listen({ port: 5000 }).then((res) => {
  console.log(`Server running at ${res.url}`);
});
