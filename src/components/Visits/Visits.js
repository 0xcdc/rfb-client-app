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
import { Button, Glyphicon, Table } from 'react-bootstrap';

class Visits extends Component {
  render() {
    let firstTen = this.props.visits;
    firstTen = firstTen.map( (visit) => {
      let date = new Date(visit.date);
      return {
        id: visit.id,
        date,
      };
    }).sort( (l,r) => {
      let cmp = r.date - l.date;
      return cmp;
    }).slice(0, 10);
    return (
        <Table striped hover >
          <thead>
            <tr>
              <th>Visits</th>
              <th/>
            </tr>
          </thead>
          <tbody>
          {firstTen.map( (visit) => {
            return (
              <tr key={visit.id}>
                <td>
                  {visit.date.toLocaleDateString('en-US', {month: "short", day: "numeric", year: "numeric"})}
                </td>
                <td>
                  <Button
                    bsStyle='link'
                    bsSize="xsmall"
                    onClick={ (e) => {this.props.onDeleteVisit && this.props.onDeleteVisit(visit.id)}}>
                    <Glyphicon glyph="remove"/>
                  </Button>
                 </td>
               </tr>
             );
          })}
          </tbody>
        </Table>
        )
  }

  static propTypes = {
    visits: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        onDeleteVisit: PropTypes.func,
      })).isRequired,
  }

}

export default withStyles(s)(Visits);

