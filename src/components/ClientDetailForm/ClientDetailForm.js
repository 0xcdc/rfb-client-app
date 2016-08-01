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
import s from './ClientDetailForm.css';
import { Col, ControlLabel, Form, FormGroup, FormControl, Radio } from 'react-bootstrap';

class ClientDetailForm extends Component {
  constructor({client}) {
    super();
    this.state = client
  }

  createHandleChange(prop) {
    return (e => {
      var newState = {}
      newState[prop] = e.target.value
      this.setState(newState)
    })
  }

  races = [
    "White or Caucasian",
    "Latino, Latino American, Hispanic",
    "Other Race",
    "Asian, Asian-American",
    "Unknown",
    "Black, African-American, Other African",
    "Multi-Racial (2+ identified)",
    "Indian-American or Alaskan-Native",
    "Hawaiian-Native or Pacific Islander",
  ]

  disabled = [
    "No",
    "Yes",
  ]

  render() {
    return (
      <div id="detailForm">
        <Form horizontal>

          <FormGroup controlId="formHorizontalHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Household Id
            </Col>
            <Col sm={10}>
              <FormControl.Static>{this.state.householdId}</FormControl.Static>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalPersonId">
            <Col componentClass={ControlLabel} sm={2}>
              Person Id
            </Col>
            <Col sm={10}>
              <FormControl.Static>{this.state.personId}</FormControl.Static>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalFirstName">
            <Col componentClass={ControlLabel} sm={2}>
              First Name
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Enter first name" value={this.state.firstName} onChange={this.createHandleChange("firstName")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalLastName">
            <Col componentClass={ControlLabel} sm={2}>
              Last Name
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Enter last name" value={this.state.lastName} onChange={this.createHandleChange("lastName")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDisabled">
            <Col componentClass={ControlLabel} sm={2}>
              Disabled
            </Col>
            <Col sm={10}>
              { this.disabled.map( (value, key) => {
                return (
                  <Radio inline value={key} checked={this.state.disabled==key} onChange={this.createHandleChange("disabled")}>{value}</Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalRace">
            <Col componentClass={ControlLabel} sm={2}>
              Race
            </Col>
            <Col sm={10}>
              <FormControl componentClass="select" placeholder="Unknown" value={this.state.race} onChange={this.createHandleChange("race")}>
              {
                this.races.map( (race) => {
                   return (
                     <option value={race}>{race}</option>
                   )
                })
              }
              </FormControl>
            </Col>
          </FormGroup>


          {JSON.stringify(this.state)}
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(ClientDetailForm);

