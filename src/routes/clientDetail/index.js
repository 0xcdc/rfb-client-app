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
import ClientDetail from './ClientDetail';
import fetch from '../../core/fetch';

const title = "RFB Client Detail";

export default {

  path: '/clients/:clientId',

  async action(context) {
    var keys = [ "id", "HouseholdId", "firstName", "lastName", "disabled", "race", "birthYear", "gender",
                 "refugeeImmigrantStatus", "limitedEnglishProficiency", "militaryStatus", "dateEntered",
                 "enteredBy", "ethnicity"];

    var id = Number(context.params.clientId);
    const { data } = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{client(id: ' + id +'){' + keys.join("\n") + "}}"

      }),
      credentials: 'include',
    }).then( (resp) => {
      return resp.json();
    });

    if (!data || !data.client) throw new Error('Failed to load the client detail.');
    return {
      title,
      component: <Layout><ClientDetail client={data.client}/></Layout>
    };
  },

};
