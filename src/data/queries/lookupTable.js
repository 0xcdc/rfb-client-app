import {
  GraphQLList as List,
  GraphQLInt as Int,
  GraphQLNonNull as NonNull,
} from 'graphql';

import LookupTableType from '../types/LookupTables';
import database from '../root';

function loadAll(name) {
  const rows = database.all(
    `
SELECT *
FROM ${name}
ORDER BY id`,
  );

  return rows;
}

function loadById(name, id) {
  const rows = database.all(
    `
SELECT *
FROM ${name}
where id = :id`,
    { id },
  );

  return rows[0];
}

export const incomeLevels = {
  type: new List(LookupTableType),
  resolve() {
    return loadAll('income_level');
  },
};

export const incomeLevel = {
  type: LookupTableType,
  args: {
    id: {
      type: new NonNull(Int),
    },
  },
  resolve(root, { id }) {
    return loadById('income_level', id);
  },
};
