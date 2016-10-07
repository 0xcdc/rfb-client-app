/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Home from './Home';
import fetch from '../../core/fetch';

const title = "RFB Client Checkin Application";

export default {

  path: '/',

  async action() {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{clients{personId, firstName, lastName}}',
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.clients) throw new Error('Failed to load the list of clients.');
    return {
      title,
      component: <Home clients={data.clients} />
    };
  },

};
