import {
  GraphQLNonNull as NonNull,
  GraphQLInt as Int,
  GraphQLString as QLString,
} from 'graphql';

import database from '../root';

export const pullNextKey = database.transaction(tableName => {
  database.run(
    `
    update keys
      set next_key = next_key + 1
      where tablename = :tableName
    `,
    { tableName },
  );

  const rows = database.all(
    `
    select next_key
    from keys
    where tablename = :tableName`,
    { tableName },
  );

  return rows[0].next_key;
});

export const nextKeyMutation = {
  type: Int,
  args: {
    tableName: {
      type: new NonNull(QLString),
    },
  },
  resolve: (root, a) => {
    const { tableName } = a;
    return pullNextKey(tableName);
  },
};
