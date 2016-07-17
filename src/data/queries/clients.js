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


let items = [
{ id: 1, name: "Charlie Carson" },
{ id: 2, name: "Darian Carson" },
{ id: 3, name: "Enda McEnda" },
{ id: 4, name: "Brian FancyPants" },
{ id: 5, name: "Meghann Stinky"},
{ id: 6, name: "Rich TheDirector"},
{ id: 7, name: "Rob WhosThat"},
];

let indexedItems = {};
items.forEach( (item) => {
  indexedItems[item.id] = item
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

