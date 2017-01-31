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

class Report extends React.Component {

  render() {
    return (
      <div>
        <Row>
          <Col xs={6}>
            <Panel header="Households Served:">
              <Table condensed>
                <tbody>
                  <tr>
                    <td>Returning:</td>
                    <td className={s.data}>{this.props.data.year}</td></tr>
                  <tr>
                    <td>First visit this month:</td>
                    <td className={s.data}>{this.props.data.month}</td></tr>
                  <tr>
                    <td>Total:</td>
                    <td className={s.data}>502</td></tr>
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
      </div>
    );
  }
}

export default withStyles(s)(Report);
