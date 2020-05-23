import {
  GraphQLInt as Int,
  GraphQLInputObjectType as InputType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

import database from '../root';
import HouseholdType from '../types/HouseholdType';
import {
  loadAll as loadAllClients,
  loadClientsForHouseholdId,
} from './clients';
import { loadById as loadCityById, loadAll as loadAllCities } from './cities';
import { recordVisit } from './visits';

function selectById(id) {
  const household = database.all(
    `
    select household.*, income_level.income_level as incomeLevel
    from household
    join income_level
      on income_level.id = household.incomeLevelId
    where household.id = :id`,
    { id },
  );

  return household;
}

function loadById(id) {
  const household = selectById(id)[0];
  household.city = loadCityById(household.cityId);
  household.clients = loadClientsForHouseholdId(id);
  return household;
}

function loadAll() {
  const households = database.all(
    `
    select household.*, income_level.income_level
    from household
    join income_level
      on income_level.id = household.incomeLevelId`,
  );
  const clients = loadAllClients();
  const cities = loadAllCities();

  const citiesMap = new Map(cities.map(city => [city.id, city]));
  const householdMap = new Map(
    households.map(h => [h.id, { ...h, city: citiesMap.get(h.cityId) }]),
  );

  clients.forEach(client => {
    const household = householdMap.get(client.householdId);
    if (!household.clients) household.clients = [];
    household.clients.push(client);
    household.householdSize = household.clients.length;
  });

  return Array.from(householdMap.values());
}

export const householdQuery = {
  type: HouseholdType,
  args: {
    id: {
      type: new NonNull(Int),
    },
  },
  resolve(root, { id }) {
    return loadById(id);
  },
};

export const households = {
  type: new List(HouseholdType),
  args: {
    ids: {
      type: new List(new NonNull(Int)),
    },
  },
  resolve(root, { ids }) {
    if (ids.length > 0) {
      return ids.map(id => loadById(id));
    }

    return loadAll();
  },
};

export const updateHousehold = {
  type: HouseholdType,
  description: 'Update a Household',
  args: {
    household: {
      name: 'UpdateHouseholdInput',
      type: new InputType({
        name: 'updateHouseholdInput',
        fields: {
          id: { type: new NonNull(Int) },
          address1: { type: new NonNull(StringType) },
          address2: { type: new NonNull(StringType) },
          cityId: { type: new NonNull(Int) },
          zip: { type: new NonNull(StringType) },
          incomeLevelId: { type: new NonNull(Int) },
          note: { type: new NonNull(StringType) },
        },
      }),
    },
  },
  resolve: (root, a) => {
    const { household } = a;
    let { id } = household;
    if (household.id === -1) {
      delete household.id;
      id = database.insert('household', household);
      recordVisit(id);
      console.error('^^^^ fix this');
    } else {
      database.update('household', household);
    }
    return loadById(id);
  },
};
