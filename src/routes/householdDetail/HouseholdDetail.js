/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import s from './HouseholdDetail.css';
import EditDetailForm from '../../components/EditDetailForm';
import { HouseholdWithClientsType } from '../../components/common';

class HouseholdDetail extends React.Component {
  static propTypes = {
    household: HouseholdWithClientsType.isRequired,
  };

  render() {
    return <EditDetailForm household={this.props.household} />;
  }
}

export default withStyles(s)(HouseholdDetail);
