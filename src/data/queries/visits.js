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
import { Visit, Household } from '../models';


export const visitsForHousehold = {
  type: new List(VisitItemType),
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { householdId } ) {
    return Visit.findAll({where: {householdId: householdId}, raw: true});
  }
};

export const recordVisit = {
  type: VisitItemType,
  description: "Record a visit by a household on the current day",
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve: (root, { householdId} ) => {
    let now = new Date();
    let date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
    return Visit.create({date, householdId}, {raw: true}).then( (vi) => {
      return vi.get();
    });
  }
};

export const deleteVisit = {
  type: VisitItemType,
  description: "Delete a visit by id",
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve: (root, { id } ) => {
    return Visit.findById(id).then( (vi) => {
      if(!vi) {
        return Promise.reject("could not find a visit with id: " + id);
      }

      return vi.destroy().then( () => {
        return vi.get();
      });
    });
  },
};
