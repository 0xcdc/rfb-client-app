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
import persons from '../../../dummy-data/person.json';
import households from '../../../dummy-data/household.json';

let indexedPersons = {};
let indexedHouseholds = {};

households.forEach( (household) => {
  household.clientCount = 0;
  indexedHouseholds[household.householdId] = household;
});

persons.forEach( (person) => {
  indexedPersons[person.personId] = person;

  indexedHouseholds[person.householdId].clientCount++;
});

persons.forEach( (person) => {
  person.householdSize = indexedHouseholds[person.householdId].clientCount;

  function cardColor(size) {
    switch(size) {
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
  }

  person.cardColor = cardColor(person.householdSize);
});

export const clients = {
  type: new List(ClientItemType),
  resolve() {
    return persons;
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
    return indexedPersons[id];
  }
}

