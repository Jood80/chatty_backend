import 'reflect-metadata';
import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';
import { redis } from './redis';

config();

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver],
    validate: true,
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error && error.extensions) {
        error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';
      }
      return error;
    },
    context: ({ req }: any) => ({ req }),
  });

  const app = Express();
  const RedisStore = connectRedis(session);

  app.use(cors());
  app.use(
    session({
      store: new RedisStore({ client: redis }),
      secret: process.env.SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: 1000 * 60 * 10, // session max age in miliseconds
      },
    }),
  );

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`server is running on port 4000`);
  });
};

main();
