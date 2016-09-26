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
import HouseholdDetailForm from '../../components/HouseholdDetailForm';

function HouseholdDetail(props, context) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Review Household Information</h1>
        <HouseholdDetailForm household={props.household}/>
      </div>
    </div>
  );
}

export default withStyles(s)(HouseholdDetail);
