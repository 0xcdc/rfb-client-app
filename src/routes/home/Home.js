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
import s from './Home.css';
import SearchBar from '../../components/SearchBar';

class Home extends React.Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        householdSize: PropTypes.number.isRequired,
        cardColor: PropTypes.string.isRequired,
        lastVisit: PropTypes.string.isRequired,
      })).isRequired,
  };

  render() {
    return (
      <SearchBar clients={this.props.clients}/>
    );
  }
}

export default withStyles(s)(Home);
