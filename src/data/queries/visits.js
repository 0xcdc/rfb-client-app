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
import VisitItemType from '../types/VisitItemType';
import visitData from '../../../dummy-data/visit.json';

let items = visitData;
let indexedItems = {};
items.forEach( (item) => {
   if(!indexedItems[item.householdId]) {
     indexedItems[item.householdId] = [];
   }
   indexedItems[item.householdId].push(item);
});

export const visits = {
  type: new List(VisitItemType),
  resolve() {
    return items;
  },
};

export const visitsForHousehold = {
  type: new List(VisitItemType),
  args: {
    householdId: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  },
  resolve(root, { householdId } ) {
    return indexedItems[householdId];
  }
}


