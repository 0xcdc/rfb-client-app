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
import { Button, Table } from 'react-bootstrap';
import s from './Visits.css';

const numberOfVisitsToShow = 8;

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
    const visitsToShow = this.props.visits
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
      .slice(0, numberOfVisitsToShow);

    return (
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th colSpan="2">Visits</th>
          </tr>
        </thead>
        <tbody>
          {visitsToShow.map(visit => {
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
                    size="sm"
                    variant="outline-dark"
                    onClick={() => {
                      this.props.onDeleteVisit(visit.id);
                    }}
                  >
                    x
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
