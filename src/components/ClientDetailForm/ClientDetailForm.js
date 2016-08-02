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

  render() {
    var races = [
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

    var yesNo= [
      "No",
      "Yes",
    ]

    var gender = [
      "Male",
      "Female",
      "Tansgendered"
    ]

    var militaryStatus = [
      "US Military Service (past or present)",
      "Partners of persons with active military service",
      "None",
    ]

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
              <FormControl
                type="text"
                placeholder="Enter first name"
                value={this.state.firstName}
                onChange={this.createHandleChange("firstName")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalLastName">
            <Col componentClass={ControlLabel} sm={2}>
              Last Name
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter last name"
                value={this.state.lastName}
                onChange={this.createHandleChange("lastName")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDisabled">
            <Col componentClass={ControlLabel} sm={2}>
              Disabled
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"disabled-"+ value}
                    inline
                    value={index}
                    checked={this.state.disabled==index}
                    onChange={this.createHandleChange("disabled")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalRace">
            <Col componentClass={ControlLabel} sm={2}>
              Race
            </Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                value={this.state.race}
                onChange={this.createHandleChange("race")}>
                  {
                    races.map( (race) => {
                       return (
                         <option key={"race-"+race} value={race}>{race}</option>
                       )
                    })
                  }
              </FormControl>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalHispanic">
            <Col componentClass={ControlLabel} sm={2}>
              Hispanic
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"hispanic-"+value}
                    inline
                    value={index}
                    checked={this.state.hispanic==index}
                    onChange={this.createHandleChange("hispanic")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalBirthYear">
            <Col componentClass={ControlLabel} sm={2}>
              Birth Year
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Birth Year"
                value={this.state.birthYear}
                onChange={this.createHandleChange("birthYear")}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalGender">
            <Col componentClass={ControlLabel} sm={2}>
              Gender
            </Col>
            <Col sm={10}>
              { gender.map( (value) => {
                  return (
                    <Radio
                      key={"gender-"+value}
                      inline
                      value={value}
                      checked={this.state.gender==value}
                      onChange={this.createHandleChange("gender")}>
                        {value}
                    </Radio>
                  )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalRefugee">
            <Col componentClass={ControlLabel} sm={2}>
              Refugee or Immigrant
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"refugee-"+value}
                    inline
                    value={index}
                    checked={this.state.refugeeImmigrantStatus==index}
                    onChange={this.createHandleChange("refugeeImmigrantStatus")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalSpeaksEnglish">
            <Col componentClass={ControlLabel} sm={2}>
              Speaks English
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"speaksEnglish-"+value}
                    inline
                    value={index}
                    checked={this.state.speaksEnglish==index}
                    onChange={this.createHandleChange("speaksEnglish")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalMilitaryStatus">
            <Col componentClass={ControlLabel} sm={2}>
              Military Status
            </Col>
            <Col sm={10}>
              { militaryStatus.map( (value) => {
                return (
                  <Radio
                    key={"military-"+value}
                    inline
                    value={value}
                    checked={this.state.militaryStatus==value}
                    onChange={this.createHandleChange("militaryStatus")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDateEntered">
            <Col componentClass={ControlLabel} sm={2}>
              Date Entered
            </Col>
            <Col sm={10}>
              <FormControl.Static>{this.state.dateEntered}</FormControl.Static>
            </Col>
          </FormGroup>

           <FormGroup controlId="formHorizontalEnteredBy">
            <Col componentClass={ControlLabel} sm={2}>
              Entered By
            </Col>
            <Col sm={10}>
              <FormControl.Static>{this.state.enteredBy}</FormControl.Static>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(ClientDetailForm);

