import {
  GraphQLNonNull as NonNull,
  GraphQLInt as Int,
  GraphQLString as QLString,
} from 'graphql';

import { pullNextKey } from '../root';

/* eslint-disable import/prefer-default-export */
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
