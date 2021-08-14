import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { RegisterResolver } from './modules/user/Register';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver],
    validate: true
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error && error.extensions) {
        error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';
      }
      return error;
    },
  });
  const app = Express();
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`server is running on port 4000`);
  });
};

main();
