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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HouseholdDetail.css';
import EditDetailForm from '../../components/EditDetailForm';
import Link from '../../components/Link';
import { Glyphicon } from 'react-bootstrap';

class HouseholdDetail extends React.Component {
  static propTypes = {
    household: PropTypes.shape({
      address1: PropTypes.string.isRequired,
      address2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
      income: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
      clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        lastCheckin: PropTypes.string,
        note: PropTypes.string,
      })).isRequired,
    }).isRequired,
  }

  static contextTypes = { graphQL: PropTypes.func.isRequired };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <EditDetailForm household={this.props.household}/>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetail);
