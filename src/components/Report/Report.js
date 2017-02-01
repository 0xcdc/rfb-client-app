/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Button, Col, Glyphicon, Label, Nav, NavItem, Panel, Row, Tab, Table } from 'react-bootstrap';
import s from './Report.css';
import { fetch } from '../common';

class Report extends React.Component {
  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {
      data: null,
      year: now.getFullYear(),
      month: now.getMonth() + 1,
    };

  }

  componentDidMount() {
    this.loadData(this.state.month, this.state.year);
  }

  loadData(month, year) {
    let query = '{visitsForMonth(month: ' + month + ', year: ' + year + '){householdId}}';
    let dataAvailable = fetch(query);
    dataAvailable.then( (json) => {
      let visits = json.data.visitsForMonth;
      let households = visits.map( (v) => {
        return v.householdId;
      });
      let uniqueHouseholds = new Set(households);
      let householdsAvailable = [];
      uniqueHouseholds.forEach( (v) => {
        let query = '{household(id:' + v + ') {firstVisit}}';
        householdsAvailable.push(fetch(query));
      });

      Promise.all(householdsAvailable).then( (values) => {
        let householdData = values.map( (v) => {
          return new Date(v.data.household.firstVisit);
        }).reduce( (acc, v) => {
          if(!acc) acc = 0
          if((v.getMonth() + 1 == month) &&
             (v.getFullYear() == year)) {
            acc += 1;
          }
        });
        console.log(householdData);
      });


      this.setState({
        data: { households }
      });
    })
  }



  render() {
    return (
      <div>
        {this.state.data &&
        <Row>
          <Col xs={6}>
            <Panel header="Households Served:">
              <Table condensed>
                <tbody>
                  <tr>
                    <td>Returning:</td>
                    <td className={s.data}></td></tr>
                  <tr>
                    <td>First visit this month:</td>
                    <td className={s.data}></td></tr>
                  <tr>
                    <td>Total:</td>
                    <td className={s.data}>{this.state.data.households.length}</td></tr>
                </tbody>
              </Table>
            </Panel>
          </Col>
          <Col xs={6}>
            <Panel header="Clients Served:">
              <Table condensed>
                <tbody>
                  <tr>
                    <td>Returning:</td>
                    <td className={s.data}>1,262</td></tr>
                  <tr>
                    <td>First visit this month:</td>
                    <td className={s.data}>16</td></tr>
                  <tr>
                    <td>Total:</td>
                    <td className={s.data}>1,278</td></tr>
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>
        }
      </div>
    );
  }
}

export default withStyles(s)(Report);
