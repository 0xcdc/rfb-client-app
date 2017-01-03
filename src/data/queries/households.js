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

import fetch from '../../core/fetch';
import ClientItemType from '../types/ClientItemType';
import HouseholdItemType from '../types/HouseholdItemType';
import { loadClientsForHouseholdId } from './clients';
import { Household } from '../models';

function loadById(id) {
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
      type: new NonNull(Int)
    },
  },
  resolve(root, { id } ) {
    return loadById(id);
  }
}

export const updateHousehold = {
  type: HouseholdItemType,
  description: "Update a Household",
  args: {
    household: {
      name: "UpdateHouseholdInput",
      type: new InputType( {
        name: "updateHouseholdInput",
        fields: {
          "id": { type: new NonNull(Int) },
          "address1": { type: new NonNull(StringType) },
          "address2": { type: new NonNull(StringType) },
          "city": { type: new NonNull(StringType) },
          "state": {type : new NonNull(StringType) },
          "zip": {type : new NonNull(StringType) },
          "income": {type : new NonNull(StringType) },
          "note": {type : new NonNull(StringType) },
          "oldHouseholdId": {type : new NonNull(StringType) },
          "dateEntered": {type : new NonNull(StringType) },
          "enteredBy": {type : new NonNull(StringType) },
        }
    })}
  },
  resolve: (root, { household } ) => {
    return Household.upsert(household).then( () => {
      return loadById(household.id);
    });
  }
};
