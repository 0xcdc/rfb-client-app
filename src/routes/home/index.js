/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

async function action({ graphQL }) {
  const { data } = await graphQL(
    '{clients{id, name, householdId, householdSize, cardColor, lastVisit, note}}',
  );

  if (!data || !data.clients) throw new Error('Failed to load the clients.');
  return {
    title: 'RFB Client Checkin Application',
    chunks: ['home'],
    component: (
      <Layout>
        <Home clients={data.clients} />
      </Layout>
    ),
  };
}

export default action;
