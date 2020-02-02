/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLInt, GraphQLList, GraphQLNonNull } from 'graphql';
import VisitItemType from '../types/VisitItemType';
import { Visit } from '../models';
import sequelize from '../root';

function selectVisitsForHousehold(householdId) {
  return sequelize.query(
    'SELECT * FROM visit where householdId = :householdId',
    {
      replacements: { householdId },
      type: sequelize.QueryTypes.SELECT,
    },
  );
}

export const visitsForHousehold = {
  type: new GraphQLList(VisitItemType),
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { householdId }) {
    return selectVisitsForHousehold(householdId);
  },
};

function formatDate(date) {
  const { year } = date;
  let { month, day } = date;
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${year}-${month}-${day}`;
}

export const firstVisitsForYear = {
  type: new GraphQLList(VisitItemType),
  args: {
    year: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve(root, { year }) {
    const firstDay = formatDate({ year, month: 1, day: 1 });
    const lastDay = formatDate({ year: year + 1, month: 1, day: 1 });

    const sql = `
       SELECT *
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

    return sequelize.query(sql, {
      replacements: { firstDay, lastDay },
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
  resolve(root, { month, year }) {
    const firstDay = formatDate({ year, month, day: 1 });
    const lastDay = formatDate({ year, month: month + 1, day: 1 });

    return sequelize.query(
      `SELECT *
       FROM visit
       WHERE date >= :firstDay and date < :lastDay`,
      {
        replacements: { firstDay, lastDay },
        type: sequelize.QueryTypes.SELECT,
      },
    );
  },
};

export function recordVisit(householdId, year, month, day) {
  let date = new Date();
  if (year && month && day) {
    date = { year, month, day };
  } else {
    date = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }
  date = formatDate(date);
  return Visit.create({ date, householdId }, { raw: true }).then(vi => {
    return vi.get();
  });
}

export const recordVisitMutation = {
  type: VisitItemType,
  description: 'Record a visit by a household on the current day',
  args: {
    householdId: { type: new GraphQLNonNull(GraphQLInt) },
    year: { type: new GraphQLNonNull(GraphQLInt) },
    month: { type: new GraphQLNonNull(GraphQLInt) },
    day: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: (root, { householdId, year, month, day }) => {
    return recordVisit(householdId, year, month, day);
  },
};

export const deleteVisit = {
  type: VisitItemType,
  description: 'Delete a visit by id',
  args: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
  },
  resolve: (root, { id }) => {
    return Visit.findById(id).then(vi => {
      if (!vi) {
        return Promise.reject(
          new Error(`could not find a visit with id: ${id}`),
        );
      }

      return vi.destroy().then(() => {
        return vi.get();
      });
    });
  },
};
