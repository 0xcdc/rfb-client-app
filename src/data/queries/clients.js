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

import ClientItemType from '../types/ClientItemType';
import { Client } from '../models';

function addHouseholdInfo(clientList) {
  clientList.forEach( (client) => {

    client.householdSize = clientList.length;

    function cardColor(count) {
      switch(count) {
        case 0:
        case 1:
        case 2:
          return "red";
        case 3:
        case 4:
          return "blue";
        case 5:
        case 6:
        case 7:
          return "yellow";
        default:
          return "green";
      }
    };

    client.cardColor = cardColor(client.householdSize);
  });
};

function loadAll() {
  return Client.findAll({raw: true}).then( (clients) => {

    //group the clients by householdId
    let households = new Map();
    clients.forEach( (client) => {
      let list = (households.get(client.householdId) || []);
      list.push(client);
      households.set(client.householdId, list);
    });

    households.forEach( (group) => {
      addHouseholdInfo(group);
    });

    return clients;
  })
};

export function loadClientsForHouseholdId(householdId) {
  return Client.findAll({raw: true, where: {householdId: householdId}}).then( (clients) => {

    addHouseholdInfo(clients);

    return clients;
  })
};

export const clients = {
  type: new List(ClientItemType),
  resolve() {
    return loadAll();
  },
}

export const client = {
  type: ClientItemType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  },
  resolve(root, { id } ) {
    return loadAll().then( (clients) => {
      return clients.find( (v) => {
        return v.id == id;
      });
    });
  }
}

