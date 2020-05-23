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
