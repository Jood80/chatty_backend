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
import { RegisterResolver } from './modules/user/resolvers/Register.resolver';
import { LoginResolver } from './modules/user/resolvers/Login.resolver';
import { MyProfileResolver } from './modules/user/resolvers/GetProfile.resolver';
import { redis } from './redis';

config();

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MyProfileResolver],
    validate: true,
    authChecker: ({ context: { req } }) => !!req.session.userId,
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error: GraphQLError): GraphQLFormattedError => {
      if (error && error.extensions) {
        error.extensions.code = 'GRAPHQL_VALIDATION_FAILED';
      }
      return error;
    },
    context: async ({ req }: any) => {
      return { req };
    },
  });

  const app = Express();
  const RedisStore = connectRedis(session);

  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS!,
      credentials: true,
    }),
  );
  app.use(
    session({
      store: new RedisStore({ client: redis as any }),
      name: 'qid',
      secret: process.env.SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 10 * 24 * 7,
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
