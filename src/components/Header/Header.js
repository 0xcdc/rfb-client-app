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
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook } from '@fortawesome/free-solid-svg-icons';
import Link from '../Link';
import s from './Header.css';

export default function Header() {
  withStyles(s);
  return (
    <div>
      <Link to="/">
        <Button>
          Home <FontAwesomeIcon icon={faHome} />
        </Button>
      </Link>
      <Link to="/report">
        <Button>
          Reports <FontAwesomeIcon icon={faBook} />
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
