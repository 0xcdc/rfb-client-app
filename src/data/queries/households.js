/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInt as Int,
  GraphQLInputObjectType as InputType,
  GraphQLList as List,
  GraphQLNonNull as NonNull,
  GraphQLString as StringType,
} from 'graphql';

import database from '../root';
import HouseholdItemType from '../types/HouseholdItemType';
import {
  loadAll as loadAllClients,
  loadClientsForHouseholdId,
} from './clients';
import { recordVisit } from './visits';

function selectById(id) {
  return database.all(
    `
    select *
    from household
    where id = :id`,
    { id },
  );
}

function loadById(id) {
  const household = selectById(id)[0];
  household.clients = loadClientsForHouseholdId(id);
  return household;
}

function loadAll() {
  const households = database.all(`select * from household`);
  const clients = loadAllClients();

  const householdMap = new Map(
    households.map(h => {
      return [h.id, h];
    }),
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
  type: HouseholdItemType,
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
  type: new List(HouseholdItemType),
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
  type: HouseholdItemType,
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
