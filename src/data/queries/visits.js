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
    HouseholdId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { HouseholdId } ) {
    return Visit.findAll({where: {HouseholdId: HouseholdId}, raw: true});
  }
};

export const recordVisit = {
  type: VisitItemType,
  description: "Record a visit by a household on the current day",
  args: {
    HouseholdId: { type: new GraphQLNonNull(GraphQLInt) }
  },
  resolve: (root, { HouseholdId} ) => {
    let now = new Date();
    let date = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
    return Visit.create({date, HouseholdId}, {raw: true}).then( (vi) => {
      return vi.get();
    });
  }
};

