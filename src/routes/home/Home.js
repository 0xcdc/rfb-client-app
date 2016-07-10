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

const title = 'React Starter Kit';

function Home({clients}, context) {
  context.setTitle(title);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <SearchBar />
        <ul className={s.clients}>
          {clients.map((item, index) => (
            <li key={index} className={s.client}>
              <span
                className={s.clientName}>
                {item.name} 
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

Home.propTypes = {
  clients: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
  })).isRequired,
};
Home.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Home);
