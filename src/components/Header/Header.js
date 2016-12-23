/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Glyphicon, Jumbotron, PageHeader } from 'react-bootstrap';
import Link from '../Link';
import s from './Header.css';

class Header extends React.Component {
  render() {
    return (
      <Jumbotron >
          <div className="container">
            <h1>Renewal Food Bank</h1>
            <p><small>Client check-in and registration application</small></p>
          </div>
      </Jumbotron>
    );
  }
}

export default withStyles(s)(Header);
