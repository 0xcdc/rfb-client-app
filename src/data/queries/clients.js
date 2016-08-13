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
import persons from '../../../dummy-data/person.json';

let items = persons;
let indexedItems = {};
items.forEach( (item) => {
  indexedItems[item.personId] = item
});

export const clients = {
  type: new List(ClientItemType),
  resolve() {
    return items;
  },
};

export const client = {
  type: ClientItemType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  },
  resolve(root, { id } ) {
    return indexedItems[id];
  }
}

