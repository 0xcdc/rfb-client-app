/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './HouseholdDetail.css';
import EditDetailForm from '../../components/EditDetailForm';
import { HouseholdWithClientsType } from '../../components/common';

class HouseholdDetail extends React.Component {
  static propTypes = HouseholdWithClientsType;

  static contextTypes = { graphQL: PropTypes.func.isRequired };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <EditDetailForm household={this.props.household} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetail);
