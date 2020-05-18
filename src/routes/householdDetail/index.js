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
import { stubHousehold } from '../../components/common';

const title = 'RFB Household Detail';
function loadHousehold(id, graphQL) {
  const query = `
    {
      household(id: ${id}) {
        id
        address1
        address2
        city
        state
        zip
        incomeLevelId
        note
        clients {
          id
          name
          householdId
          gender
          disabled
          refugeeImmigrantStatus
          ethnicity
          race
          speaksEnglish
          militaryStatus
          birthYear
        }
      }
    }`;

  return graphQL(query).then(({ data }) => {
    if (!data || !data.household)
      throw new Error('Failed to load the household detail.');
    return data.household;
  });
}

async function action(context) {
  const id = Number(context.params.householdId);
  const household =
    id === -1 ? stubHousehold() : await loadHousehold(id, context.graphQL);

  return {
    title,
    chunks: ['householdDetail'],
    component: (
      <Layout>
        <HouseholdDetail household={household} />
      </Layout>
    ),
  };
}

export default action;
