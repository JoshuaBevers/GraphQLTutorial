import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  orm.getMigrator().up();
  const post = orm.em.create(Post, { title: 'my first post' });
  await orm.em.persistAndFlush(post);
};
console.log(__dirname);
main().catch((err) => {
  console.log(err);
});

console.log('hello there');
