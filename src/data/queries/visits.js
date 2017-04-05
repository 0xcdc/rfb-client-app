/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import VisitItemType from '../types/VisitItemType';
import { Visit, Household } from '../models';
import sequelize from '../root';

function selectVisitsForHousehold(householdId) {
  return sequelize.query(
      "SELECT * FROM visit where householdId = :householdId",
      { replacements: { householdId },
        type: sequelize.QueryTypes.SELECT,
      });
}

export const visitsForHousehold = {
  type: new GraphQLList(VisitItemType),
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { householdId } ) {
    return selectVisitsForHousehold(householdId);
  }
};

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if(month < 10) month = "0" + month;
  let day = date.getDate();
  if(day < 10) day = "0" + day;
  return [year, month, day].join("-");
}

export const firstVisitsForYear = {
  type: new GraphQLList(VisitItemType),
  args: {
    year: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve( root, { year } ) {
    // 0 b/c months are 0 based
    let firstDay = formatDate(new Date(year, 0, 1));
    let lastDay = formatDate(new Date(year + 1, 0, 1));

    let sql =
      `SELECT *
       FROM visit v1
       WHERE v1.date >= :firstDay
         AND v1.date < :lastDay
         AND NOT EXISTS (
           SELECT *
           FROM visit v2
           WHERE v2.date >= :firstDay
             AND v2.date < :lastDay
             AND v2.date < v1.date
             AND v2.householdId = v1.householdId
         )`;

    return sequelize.query(
        sql,
        { replacements: { firstDay, lastDay },
          type: sequelize.QueryTypes.SELECT,
        });
  },
};

export const visitsForMonth = {
  type: new GraphQLList(VisitItemType),
  args: {
    year: { type: new GraphQLNonNull(GraphQLInt) },
    month: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { month, year} ) {
    //months are 0 based
    month -= 1;
    let firstDay = formatDate(new Date(year, month, 1));
    let lastDay = formatDate(new Date(year, month + 1, 1));

    return sequelize.query(
      `SELECT *
       FROM visit
       WHERE date >= :firstDay and date < :lastDay`,
      { replacements: { firstDay, lastDay },
        type: sequelize.QueryTypes.SELECT,
      });
  }
};

export function recordVisit(householdId, year, month, day) {
  let date = new Date();
  if(year && month && day) {
    date = new Date([year, month, day].join("-"));
  }
  date = formatDate(date);
  return Visit.create({date, householdId}, {raw: true}).then( (vi) => {
    return vi.get();
  });
}

export const recordVisitMutation = {
  type: VisitItemType,
  description: "Record a visit by a household on the current day",
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    month: { type: new GraphQLNonNull(GraphQLInt) },
    day: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: (root, { householdId, year, month, day} ) => {
    return recordVisit(householdId, year, month, day);
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
