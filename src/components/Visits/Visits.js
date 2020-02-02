/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Glyphicon, Table } from 'react-bootstrap';
import s from './Visits.css';

class Visits extends Component {
  static propTypes = {
    visits: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    onDeleteVisit: PropTypes.func.isRequired,
  };

  render() {
    let firstTen = this.props.visits;
    firstTen = firstTen
      .map(visit => {
        const dateparts = visit.date.split('-');
        // month is 0 based
        dateparts[1] -= 1;
        const date = new Date(...dateparts);
        return {
          id: visit.id,
          date,
        };
      })
      .sort((l, r) => {
        const cmp = r.date - l.date;
        return cmp;
      })
      .slice(0, 10);

    return (
      <Table striped hover>
        <thead>
          <tr>
            <th>Visits</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {firstTen.map(visit => {
            return (
              <tr key={visit.id}>
                <td>
                  {visit.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td>
                  <Button
                    bsStyle="link"
                    bsSize="xsmall"
                    onClick={() => {
                      this.props.onDeleteVisit(visit.id);
                    }}
                  >
                    <Glyphicon glyph="remove" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default withStyles(s)(Visits);
