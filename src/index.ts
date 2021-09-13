import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const post = await orm.em.create(Post, { title: 'my first post' });
  orm.em.persistAndFlush(post);
  console.log(post);

  app.listen(4000, () => {
    console.log('server started on local host 4000');
  });
};

main().catch((err) => {
  console.log(err);
});

console.log('hello there');
