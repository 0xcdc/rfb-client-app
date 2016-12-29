/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLList as List,
  GraphQLNonNull,
  GraphQLInt
} from 'graphql';

import fetch from '../../core/fetch';
import ClientItemType from '../types/ClientItemType';
import HouseholdItemType from '../types/HouseholdItemType';
import { loadClientsForHouseholdId } from './clients';
import { Household } from '../models';

function loadHousehold(id) {
  return Household.findById(id, {raw: true}).then( (household) => {
    return loadClientsForHouseholdId(household.id).then( (clients) => {
      household.clients = clients;
      household.householdSize = clients.length;
      return household;
    });
  });
};

export const household = {
  type: HouseholdItemType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  },
  resolve(root, { id } ) {
    return loadHousehold(id);
  }
}

