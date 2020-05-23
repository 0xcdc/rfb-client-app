import {
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLInt as Int,
} from 'graphql';

import IncomeLevelType from '../types/IncomeLevelType';
import database from '../root';

export function loadAll() {
  const incomeLevels = database.all(
    `
SELECT *
FROM income_level`,
  );

  return incomeLevels;
}

export function loadById(id) {
  const incomeLevels = database.all(
    `
SELECT *
FROM income_level
where id = :id`,
    { id },
  );

  return incomeLevels[0];
}

export const incomeLevels = {
  type: new List(IncomeLevelType),
  resolve() {
    return loadAll();
  },
};

export const incomeLevel = {
  type: IncomeLevelType,
  args: {
    id: {
      type: new NonNull(Int),
    },
  },
  resolve(root, { id }) {
    return loadById(id);
  },
};
