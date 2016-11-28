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
import s from './Clients.css';
import Link from '../Link';
import { Glyphicon, Table } from 'react-bootstrap';

class Clients extends Component {
  render() {
    return (
        <Table condensed hover striped>
          {this.props.header &&
          <thead>
            <tr>
              <td> Clients</td>
              <td />
            </tr>
          </thead>
          }
          <tbody>
          {this.props.clients.map( (client) =>
              {
                return (
                    <tr key={client.personId}>
                      <td className={s.client}>
                        {client.firstName} {client.lastName}
                      </td>
                      <td className={s.editIcon}>
                        <Link to={"/clients/" + client.personId}>
                          <Glyphicon glyph="pencil"/>
                        </Link>
                      </td>
                    </tr>
                    );
             })
          }
          </tbody>
        </Table>
        )
  }

  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        personId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      })).isRequired,
    header: PropTypes.bool,
  }

}

export default withStyles(s)(Clients);

