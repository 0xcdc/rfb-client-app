/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import withStyles from 'isomorphic-style-loader/withStyles';
import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import Link from '../Link';
import s from './Header.css';

export default function Header() {
  withStyles(s);
  return (
    <div>
      <Link to="/">
        <Button>
          Home <Glyphicon glyph="home" />
        </Button>
      </Link>
      <Link to="/report">
        <Button>
          Reports <Glyphicon glyph="book" />
        </Button>
      </Link>
      <br />
      <Link to="/">
        <img
          src="/default-logo.png"
          className="img-responsive"
          alt="Renewal Food Bank Logo"
        />
      </Link>
    </div>
  );
}
