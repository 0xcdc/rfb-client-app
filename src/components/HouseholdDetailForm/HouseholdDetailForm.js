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
import s from './HouseholdDetailForm.css';
import { Col, ControlLabel, Form, FormGroup, FormControl, Radio } from 'react-bootstrap';
import Client from '../Client';

const FormControlStatic = FormControl.Static;

class HouseholdDetailForm extends Component {
  constructor({household}) {
    super();
    this.state = household
  }

  createHandleChange(prop) {
    return (e => {
      var newState = {}
      newState[prop] = e.target.value
      this.setState(newState)
    })
  }

  income = [
    "<$24,000",
    "$24,000 - <$40,000",
    "$40,000 - <$64,000",
    ">$64,000",
  ]

  render() {
    return (
      <div>
        <Form horizontal>

          <FormGroup controlId="formHorizontalHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Household Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.householdId}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalAddress1">
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 1)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter address (line 1)"
                value={this.state.address1}
                onChange={this.createHandleChange("address1")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalAddress2">
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 2)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Address (line 2)"
                value={this.state.address2}
                onChange={this.createHandleChange("address2")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalCity">
            <Col componentClass={ControlLabel} sm={2}>
              City
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter City"
                value={this.state.city}
                onChange={this.createHandleChange("city")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalState">
            <Col componentClass={ControlLabel} sm={2}>
              State
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter State"
                value={this.state.state}
                onChange={this.createHandleChange("state")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalZip">
            <Col componentClass={ControlLabel} sm={2}>
              Zip
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Zip"
                value={this.state.zip}
                onChange={this.createHandleChange("zip")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalIncome">
            <Col componentClass={ControlLabel} sm={2}>
              Income
            </Col>
            <Col sm={10}>
              { this.income.map( (value) => {
                return (
                  <Radio
                    key={"income-"+value}
                    value={value}
                    checked={this.state.income==value}
                    onChange={this.createHandleChange("income")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalClients">
            <Col componentClass={ControlLabel} sm={2} >
                Clients:
            </Col>
            <Col sm={10}>
              {this.state.clients.map( (client) => {
                return <Client key={client.personId} client={client}/>
              })}
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalNote">
            <Col componentClass={ControlLabel} sm={2}>
              Note
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.note}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalOldHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Old Household Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.oldHouseholdId}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDateEntered">
            <Col componentClass={ControlLabel} sm={2}>
              Date Entered
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.dateEntered}</FormControlStatic>
            </Col>
          </FormGroup>

           <FormGroup controlId="formHorizontalEnteredBy">
            <Col componentClass={ControlLabel} sm={2}>
              Entered By
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.enteredBy}</FormControlStatic>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetailForm);

