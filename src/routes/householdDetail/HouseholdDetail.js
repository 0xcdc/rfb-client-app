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
import s from './HouseholdDetail.css';
import ClientDetailForm from '../../components/ClientDetailForm';

const title = 'Renewel Food Bank'

function HouseholdDetail(props, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Review Household Information</h1>
        <ClientDetailForm client={props.client}/>
      </div>
    </div>
  );
}

HouseholdDetail.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(HouseholdDetail);