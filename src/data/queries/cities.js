import {
  GraphQLInt as Int,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
} from 'graphql';

import database from '../root';
import CityType from '../types/CityType';

export function loadAll() {
  const cities = database.all(
    `
SELECT *
FROM city
ORDER BY name`,
  );

  return cities;
}

export function loadById(id) {
  const cities = database.all(
    `
SELECT *
FROM city
where id = :id`,
    { id },
  );

  return cities[0];
}

export const cities = {
  type: new List(CityType),
  resolve() {
    return loadAll();
  },
};

export const city = {
  type: CityType,
  args: {
    id: {
      type: new NonNull(Int),
    },
  },
  resolve(root, { id }) {
    return loadById(id);
  },
};
