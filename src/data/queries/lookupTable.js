import {
  GraphQLList as List,
  GraphQLInt as Int,
  GraphQLNonNull as NonNull,
} from 'graphql';

import LookupTableType from '../types/LookupTables';
import database from '../root';

function loadAll(tableName) {
  const rows = database.all(
    `
SELECT *
FROM ${tableName}
ORDER BY id`,
  );

  return rows;
}

function loadById(tableName, id) {
  const rows = database.all(
    `
SELECT *
FROM ${tableName}
where id = :id`,
    { id },
  );

  return rows[0];
}

function lookupItem(tableName) {
  return {
    type: LookupTableType,
    args: {
      id: {
        type: new NonNull(Int),
      },
    },
    resolve(root, { id }) {
      return loadById(tableName, id);
    },
  };
}

function lookupSet(tableName) {
  return {
    type: new List(LookupTableType),
    resolve() {
      return loadAll(tableName);
    },
  };
}

function lookupPair(tableName) {
  return [lookupItem(tableName), lookupSet(tableName)];
}

export const [ethnicity, ethnicities] = lookupPair('ethnicity');
export const [incomeLevel, incomeLevels] = lookupPair('income_level');
export const [race, races] = lookupPair('race');
export const [gender, genders] = lookupPair('gender');
export const [militaryStatus, militaryStatuses] = lookupPair('militaryStatus');
export const [yesNo, yesNos] = lookupPair('yes_no');
