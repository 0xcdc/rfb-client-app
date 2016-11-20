/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ClientDetail.css';
import ClientDetailForm from '../../components/ClientDetailForm';

function ClientDetail(props, context) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Review Client Information</h1>
        <ClientDetailForm client={props.client}/>
      </div>
    </div>
  );
}

export default withStyles(s)(ClientDetail);
