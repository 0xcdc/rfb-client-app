/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Client.css';
import editIconURL from './edit-client.png';

class Client extends Component {
  constructor({client}) {
    super();
    this.client = client
  }

  render() {
    return (
      <div className={s.client} id={this.client.name}>{this.client.name}
        <img className={s.editIcon} src={editIconURL} />
      </div>
    );
  }
}

export default withStyles(s)(Client);

