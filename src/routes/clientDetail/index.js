/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import ClientDetail from './ClientDetail';
import fetch from '../../core/fetch';

export default {

  path: '/clients/:clientId',

  async action(context) {
    var keys = [ "personId", "householdId", "firstName", "lastName",
                 "disabled", "race", "birthYear", "gender",
                 "refugeeImmigrantStatus", "limitedEnglishProficiency", "militaryStatus", "dateEntered",
                 "enteredBy", "ethnicity"];

    var id = Number(context.params.clientId);
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{client(id: ' + id +'){' + keys.join("\n") + "}}"

      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (!data || !data.client) throw new Error('Failed to load the client detail.');
    return {
      component: <ClientDetail client={data.client}/>
    };
  },

};
