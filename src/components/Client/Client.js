/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Client.css';
import Link from '../Link';
import { Glyphicon } from 'react-bootstrap';

class Client extends Component {
  constructor({client}) {
    super();
    this.client = client
  }

  render() {
    return (
      <div className={s.client}>{this.client.firstName} {this.client.lastName}
        <Link to={"/clients/" + this.client.personId}>
          <Glyphicon className={s.editIcon} glyph="pencil"/>
        </Link>
      </div>
    );
  }
}

Client.propTypes = {
  client: PropTypes.shape({
    personId: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  })
}

export default withStyles(s)(Client);

