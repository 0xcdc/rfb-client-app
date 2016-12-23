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
import s from './Visits.css';
import Link from '../Link';
import { Glyphicon, Table } from 'react-bootstrap';

class Visits extends Component {
  render() {
    return (
        <Table striped hover >
          <thead>
            <tr>
              <th>Visits</th>
              <th/>
            </tr>
          </thead>
          <tbody>
          {this.props.visits.map( (visit) =>
              {
                return (
                    <tr key={visit["date"]}>
                      <td>
                        {visit["date"]}
                      </td>
                      <td>
                        <Glyphicon glyph="remove"/>
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
    visits: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
      })).isRequired,
  }

}

export default withStyles(s)(Visits);

