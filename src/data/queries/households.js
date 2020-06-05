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
import { incrementHouseholdVersion } from './increment';

function selectById({ id, version }) {
  const sql = `
    select *
    from household
    where household.id = :id
      and version = :version`;
  const household = database.all(sql, { id, version });

  return household;
}

function getLatestVersion(id) {
  const rows = database.all(
    `
    select max(version) as version
    from household
    where id = :id`,
    { id },
  );

  if (rows.length > 0) {
    return rows[0].version;
  }
  return -1;
}

function loadById({ id, version }) {
  const household = selectById({ id, version })[0];
  household.city = loadCityById(household.cityId);
  household.clients = loadClientsForHouseholdId(id, household.version);
  return household;
}

function loadAll() {
  const households = database.all(
    `
    select *
    from household h
    where not exists (
      select 1
      from household h2
      where h1.id = h2.id
        and h2.version > h1.version`,
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
    id: { type: NonNull(Int) },
    version: { type: Int },
  },
  resolve(root, { id, version }) {
    const v = version || getLatestVersion(id);
    return loadById({ id, version: v });
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
      return ids.map(id => loadById({ id, version: getLatestVersion(id) }));
    }

    return loadAll();
  },
};

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["household"] }] */
function saveHousehold(household) {
  if (household.id === -1) {
    database.upsert('household', household, { isVersioned: true });
  } else {
    household.version = incrementHouseholdVersion(household.id);
    database.update('household', household);
  }
}

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
    const isNew = household.id === -1;
    saveHousehold(household);
    if (isNew) {
      recordVisit(household.id);
    }
    return loadById(household);
  },
};
