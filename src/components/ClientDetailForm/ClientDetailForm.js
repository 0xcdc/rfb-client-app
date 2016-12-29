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
import Link from '../Link';
import { Button, Col, ControlLabel, Form, FormGroup, FormControl, Glyphicon, Radio } from 'react-bootstrap';

const FormControlStatic = FormControl.Static;

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
      "Asian, Asian-American",
      "Black, African-American, Other African",
      "Latino, Latino American, Hispanic",
      "Hawaiian-Native or Pacific Islander",
      "Indian-American or Alaskan-Native",
      "White or Caucasian",
      "Other Race",
      "Multi-Racial (2+ identified)",
      "Unknown",
    ]

    var yesNo= [
      "No",
      "Yes",
    ]

    var gender = [
      "Male",
      "Female",
      "Transgendered"
    ]

    var militaryStatus = [
      "US Military Service (past or present)",
      "Partners of persons with active military service",
      "None",
    ]

    var ethnicity = [
      "Hispanic, Latino",
      "Other",
    ]

    return (
      <div>
        <Form horizontal>

          <FormGroup controlId="formHorizontalHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Household Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>
                {this.state.HouseholdId}

                <Button href={`/households/${this.state.HouseholdId}`} bsSize="xs" bsStyle="link">
                  <Glyphicon className='{s.editIcon}' glyph='pencil'/>
                </Button>
              </FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalId">
            <Col componentClass={ControlLabel} sm={2}>
              Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.id}</FormControlStatic>
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

          <FormGroup controlId="formHorizontalEthnicity">
            <Col componentClass={ControlLabel} sm={2}>
              Ethnicity
            </Col>
            <Col sm={10}>
              { ethnicity.map( (value, index) => {
                return (
                  <Radio
                    key={"ethnicity-"+value}
                    inline
                    value={index}
                    checked={this.state.ethnicity==value}
                    onChange={this.createHandleChange("ethnicity")}>
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

         <FormGroup controlId="formHorizontalLimitedEnglishProficiency">
            <Col componentClass={ControlLabel} sm={2}>
              Limited English Proficiency
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"limitedEnglishProficiency-"+value}
                    inline
                    value={index}
                    checked={this.state.limitedEnglishProficiency==index}
                    onChange={this.createHandleChange("limitedEnglishProficiency")}>
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

export default withStyles(s)(ClientDetailForm);

