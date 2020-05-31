import React from 'react';
import FixIt from '../../components/FixIt';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'RFB Client Checkin Application',
    chunks: ['fixit'],
    component: (
      <Layout>
        <FixIt />
      </Layout>
    ),
  };
}

export default action;
