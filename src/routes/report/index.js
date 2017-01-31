/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Report from '../../components/Report';
import Layout from '../../components/Layout';

const title = "RFB Client Checkin Application";

export default {

  path: '/report',

  action(context) {
    let data = monthlyReportData();
    return {
      title,
      component: <Layout><Report/></Layout>
    };
  },

};
