import React from 'react';
import Report from '../../components/Report';
import Layout from '../../components/Layout';

async function action() {
  return {
    title: 'RFB Client Checkin Application',
    chunks: ['report'],
    component: (
      <Layout>
        <Report />
      </Layout>
    ),
  };
}

export default action;
