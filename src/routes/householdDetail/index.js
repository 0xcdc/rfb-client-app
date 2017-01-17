/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import HouseholdDetail from './HouseholdDetail';
import fetch from '../../core/fetch';

const title = "RFB Household Detail";

export default {

  path: '/households/:householdId',

  async action(context) {
    var id = Number(context.params.householdId);

    var query = `
    {
      household(id: ${id}) {
        id
        address1
        address2
        city
        state
        zip
        income
        note
        oldHouseholdId
        dateEntered
        enteredBy
        clients {
          id
          firstName
          lastName
          householdId
          gender
          disabled
          refugeeImmigrantStatus
          ethnicity
          race
          speaksEnglish
          militaryStatus
          dateEntered
          birthYear
          enteredBy
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
    return {
      title,
      component: <Layout><HouseholdDetail household={data.household}/></Layout>
    };
  },

};
