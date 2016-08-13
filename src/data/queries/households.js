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
import person from '../../../dummy-data/person.json';
import households from '../../../dummy-data/household.json';

let items = households;
let indexedItems = {};
items.forEach( (item) => {
  item.clients = [];
  indexedItems[item.householdId] = item;
});

person.forEach( (client) => {
  let household = indexedItems[client.householdId];
  if(household) {
    household.clients.push(client);
  } else {
    console.log(JSON.stringify(client) + " has a none existant householdId");
  }
})

items.forEach( (item) => {
  item.householdSize = item.clients.length;
})

export const household = {
  type: HouseholdItemType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  },
  resolve(root, { id } ) {
    return indexedItems[id];
  }
}

