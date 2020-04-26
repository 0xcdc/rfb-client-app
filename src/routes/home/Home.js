/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import useStyles from 'isomorphic-style-loader/useStyles';
import React from 'react';
import PropTypes from 'prop-types';
import s from './Home.css';
import SearchBar from '../../components/SearchBar';

export default function Home({ clients }) {
  useStyles(s);
  return <SearchBar clients={clients} />;
}

Home.propTypes = {
  clients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      householdId: PropTypes.number.isRequired,
      householdSize: PropTypes.number.isRequired,
      cardColor: PropTypes.string.isRequired,
      lastVisit: PropTypes.string,
      note: PropTypes.string,
    }),
  ).isRequired,
};
