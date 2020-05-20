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

import HouseholdItemType from '../types/HouseholdItemType';
import { loadAll as clientLoadAll, loadClientsForHouseholdId } from './clients';
import { recordVisit } from './visits';
import { Household } from '../models';

function loadById(id) {
  return Household.findByPk(id, { raw: true }).then(household => {
    return loadClientsForHouseholdId(household.id).then(clients => {
      const retval = household;
      retval.clients = clients;
      retval.householdSize = clients.length;
      return retval;
    });
  });
}

function loadAll() {
  return Promise.all([Household.findAll({ raw: true }), clientLoadAll()]).then(
    ([households, clients]) => {
      const retval = new Map(
        households.map(h => {
          return [h.id, h];
        }),
      );

      clients.forEach(c => {
        const h = retval.get(c.householdId);
        if (!h.clients) h.clients = [];
        h.clients.push(c);
        h.householdSize = h.clients.length;
      });

      return Array.from(retval.values());
    },
  );
}

export const household = {
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
      return Promise.all(
        ids.map(id => {
          return loadById(id);
        }),
      );
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
    const { household: h } = a;
    if (h.id === -1) {
      delete h.id;
      return Household.create(h, { raw: true }).then(newH => {
        return recordVisit(newH.id).then(() => {
          return newH;
        });
      });
    }

    return Household.upsert(h).then(() => {
      return loadById(h.id);
    });
  },
};
