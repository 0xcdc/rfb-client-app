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
import VisitItemType from '../types/VisitItemType';
import { Visit, Household } from '../models';

function selectVisitsForHousehold(householdId) {
  return Visit.findAll({where: {householdId}, raw: true});
}

export const visitsForHousehold = {
  type: new List(VisitItemType),
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { householdId } ) {
    return selectVisitsForHousehold(householdId);
  }
};

export const visitsForMonth = {
  type: new List(VisitItemType),
  args: {
    year: { type: new GraphQLNonNull(GraphQLInt) },
    month: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { month, year} ) {
    return Visit.findAll({where: {householdId: month}, raw: true});
  }
};

export function minVisitForHousehold(householdId) {
  return selectVisitsForHousehold(householdId).then( (visits) => {
    return visits.map( (visit) => {
      return new Date(visit.date);
    }).reduce( (acc, current) => {
      if(!acc) return current;
      if(!current) return acc;
      if(acc < current) return acc;
      return current;
    });
  });
}


export const recordVisit = {
  type: VisitItemType,
  description: "Record a visit by a household on the current day",
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve: (root, { householdId} ) => {
    let date = new Date().toUTCString();
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
