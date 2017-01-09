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
import s from './ClientDetailForm.css';
import { fetch, TrackingObject } from '../common';
import Link from '../Link';
import { Button, Col, ControlLabel, Form, FormGroup, FormControl, Glyphicon, Radio } from 'react-bootstrap';

const FormControlStatic = FormControl.Static;

class ClientDetailForm extends Component {
  static propTypes = {
    client: PropTypes.shape({
      value: PropTypes.shape({
        id: PropTypes.number.isRequired,
        householdId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        disabled: PropTypes.string.isRequired,
        birthYear: PropTypes.string.isRequired,
        refugeeImmigrantStatus: PropTypes.string.isRequired,
        ethnicity: PropTypes.string.isRequired,
        race: PropTypes.string.isRequired,
        limitedEnglishProficiency: PropTypes.string.isRequired,
        militaryStatus: PropTypes.string.isRequired,
        dateEntered: PropTypes.string.isRequired,
        enteredBy: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  createHandleChange(prop) {
    return (e) => {
      let client = this.props.client;
      client.value[prop] = e.target.value;
      client.signalChanges();
    };
  }

  handleSave() {
    var completed = this.state.client.saveChanges("updateClient", "client");
    completed.then( () => {
      let client = this.state.client;
      this.setState( { client });
    });

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
                {this.props.client.value.householdId}
              </FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalId">
            <Col componentClass={ControlLabel} sm={2}>
              Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.props.client.value.id}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalFirstName"
            validationState={this.props.client.getValidationState("firstName")}
          >
            <Col componentClass={ControlLabel} sm={2}>
              First Name
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter first name"
                value={this.props.client.value.firstName}
                onChange={this.createHandleChange("firstName")}
              />
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalLastName"
            validationState={this.props.client.getValidationState("lastName")}
          >
            <Col componentClass={ControlLabel} sm={2}>
              Last Name
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter last name"
                value={this.props.client.value.lastName}
                onChange={this.createHandleChange("lastName")}/>
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalGender"
            validationState={this.props.client.getValidationState("gender")}>
            <Col componentClass={ControlLabel} sm={2}>
              Gender
            </Col>
            <Col sm={10}>
              { gender.map( (value) => {
                  return (
                    <Radio
                      key={"gender-"+value}
                      value={value}
                      checked={this.props.client.value.gender==value}
                      onChange={this.createHandleChange("gender")}>
                        {value}
                    </Radio>
                  )})
              }
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalDisabled"
            validationState={this.props.client.getValidationState("disabled")}>
            <Col componentClass={ControlLabel} sm={2}>
              Disabled
            </Col>
            <Col sm={10}>
              { yesNo.map( (value, index) => {
                return (
                  <Radio
                    key={"disabled-"+ value}
                    value={index}
                    checked={this.props.client.value.disabled==index}
                    onChange={this.createHandleChange("disabled")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalBirthYear"
            validationState={this.props.client.getValidationState("birthYear")}>
            <Col componentClass={ControlLabel} sm={2}>
              Birth Year
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Birth Year"
                value={this.props.client.value.birthYear}
                onChange={this.createHandleChange("birthYear")}/>
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalRefugee"
            validationState={this.props.client.getValidationState("refugeeImmigrantStatus")}>
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
                    checked={this.props.client.value.refugeeImmigrantStatus==index}
                    onChange={this.createHandleChange("refugeeImmigrantStatus")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalEthnicity"
            validationState={this.props.client.getValidationState("ethnicity")}>
            <Col componentClass={ControlLabel} sm={2}>
              Ethnicity
            </Col>
            <Col sm={10}>
              { ethnicity.map( (value, index) => {
                return (
                  <Radio
                    key={"ethnicity-"+value}
                    inline
                    value={value}
                    checked={this.props.client.value.ethnicity==value}
                    onChange={this.createHandleChange("ethnicity")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalRace"
            validationState={this.props.client.getValidationState("race")}>
            <Col componentClass={ControlLabel} sm={2}>
              Race
            </Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                value={this.props.client.value.race}
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

          <FormGroup
            controlId="formHorizontalLimitedEnglishProficiency"
            validationState={this.props.client.getValidationState("limitedEnglishProficiency")}>
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
                    checked={this.props.client.value.limitedEnglishProficiency==index}
                    onChange={this.createHandleChange("limitedEnglishProficiency")}>
                      {value}
                  </Radio>
                )})
              }
            </Col>
          </FormGroup>

          <FormGroup
            controlId="formHorizontalMilitaryStatus"
            validationState={this.props.client.getValidationState("militaryStatus")}>
            <Col componentClass={ControlLabel} sm={2}>
              Military Status
            </Col>
            <Col sm={10}>
              { militaryStatus.map( (value) => {
                return (
                  <Radio
                    key={"military-"+value}
                    value={value}
                    checked={this.props.client.value.militaryStatus==value}
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
              <FormControlStatic>{this.props.client.value.dateEntered}</FormControlStatic>
            </Col>
          </FormGroup>

           <FormGroup controlId="formHorizontalEnteredBy">
            <Col componentClass={ControlLabel} sm={2}>
              Entered By
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.props.client.value.enteredBy}</FormControlStatic>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(ClientDetailForm);

