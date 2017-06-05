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
import Link from '../Link';
import s from './Header.css';
import { Button, Glyphicon } from 'react-bootstrap';

class Header extends React.Component {
  render() {
    return (
      <div>
        <Link to="/"><Button>Home <Glyphicon glyph='home'/></Button></Link>
        <Link to="/report"><Button>Reports <Glyphicon glyph='book'/></Button></Link>
        <br/>
        <Link to='/'>
           <img src="/default-logo.png" className="img-responsive"/>
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(Header);
