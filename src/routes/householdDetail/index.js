/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import HouseholdDetail from './HouseholdDetail';
import fetch from '../../core/fetch';

export default {

  path: '/households/:householdId',

  async action(context) {
    var id = Number(context.params.householdId);

    var query = `
    {
      household(id: ${id}) {
        householdId
        address1
        address2
        city
        state
        zip
        income
        householdSize
        note
        oldHouseholdId
        dateEntered
        enteredBy
        clients {
          personId
          firstName
          lastName
        }
      }
    }`

    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query

      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.household) throw new Error('Failed to load the household detail.');
    return { component: <HouseholdDetail household={data.household}/> };
  },

};
