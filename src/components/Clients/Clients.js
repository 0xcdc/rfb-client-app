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
import { Badge, Glyphicon, Table } from 'react-bootstrap';

class Clients extends Component {
  render() {
    return (
        <Table hover striped>
          {this.props.header &&
          <thead>
            <tr>
              {this.props.showSelection && <th className={s.selectionColumn}/>}
              <th>Clients</th>
              <th/>
            </tr>
          </thead>
          }
          <tbody>
          {this.props.clients.map( (client, index) =>
              {
                var selectedRow = this.props.showSelection && client.id == this.props.selectedClientId;
                return (
                    <tr key={client.id} className={selectedRow ? "info" : ""}>
                      {this.props.showSelection &&
                      <td className={s.selectionColumn}>
                        {selectedRow ? <Glyphicon glyph="chevron-right"/> : ""}
                      </td>}
                      <td
                        onClick={() => {this.props.onClientSelect && this.props.onClientSelect(client, index)}}
                        onDoubleClick={() => {this.props.onClientDoubleClick && this.props.onClientDoubleClick(client, index)}}
                        >
                        {client.firstName} {client.lastName}
                        <Badge
                          style={{
                            backgroundColor: client.cardColor,
                            color: client.cardColor == "yellow" ? "black" : "white"
                          }}
                          pullRight>
                          {client.householdSize}
                        </Badge>
                      </td>
                      <td className={s.editIcon}>
                        <Link to={"/households/" + client.householdId}>
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
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdSize: PropTypes.number,
      })).isRequired,
    header: PropTypes.bool,
    onClientSelect: PropTypes.func,
    onClientDoubleClick: PropTypes.func,
    showSelection: PropTypes.bool,
    selectedClientId: PropTypes.number,
  }

}

export default withStyles(s)(Clients);

