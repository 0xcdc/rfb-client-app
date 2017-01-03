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
import { clone, TrackingObject } from '../common';
import { Button, Col, ControlLabel, Form, FormGroup, FormControl, Glyphicon, Radio } from 'react-bootstrap';
import Clients from '../Clients';
import Link from '../Link';

const FormControlStatic = FormControl.Static;

class HouseholdDetailForm extends Component {
  constructor(props) {
    super(props);
    let clients = Array.from(props.household.clients);
    let household = clone(props.household);
    delete household.clients;
    this.state = {
      household: new TrackingObject(household),
      isSaving: false,
      clients,
    };

    this.handleSave = this.handleSave.bind(this);
  }

  createHandleChange(prop) {
    return (e) => {
      let household = this.state.household;
      household.value[prop] = e.target.value;
      this.setState({ household })
    };
  }

  income = [
    "<$24,000",
    "$24,000 - <$40,000",
    "$40,000 - <$64,000",
    ">$64,000",
  ];

  hasAnyChanges() {
    return this.state.household.hasAnyChanges();
  };

  hasChanges(k) {
    return this.state.household.hasChanges(k);
  };

  handleSave() {
    this.setState({ isSaving: true, });

    var completed = this.state.household.saveChanges("updateHousehold", "household");
    completed.then( () => {
      let household = this.state.household;
      this.setState( { household, isSaving: false, });
    });

  }

  isFormValid() {
    return this.state.household.keys().every( (k) => {
      return this.isValid(k);
    });
  }

  isValid(key) {
    switch(key) {
      case "firstName":
      case "lastName":
        if(this.state.household.value[key].length == 0) {
          return false;
        }
        break;
    }
    return true;
  }

  getValidationState(key) {
    if(!this.isValid(key)) {
      return "error";
    }
    else if (this.hasChanges(key)) {
      return "success";
    }
    else {
      return null;
    }
  }

render() {
    return (
      <div>
        <Link to="/">Add a new client to this household <Glyphicon glyph="plus"/></Link>
        <Form horizontal>

          <FormGroup controlId="formHorizontSaveButton">
            <Col sm={4} >
              <Button
                bsStyle={
                  !this.isFormValid() ? "danger" :
                    this.state.isSaving ? "info" :
                      this.hasAnyChanges() ? "success" :
                        "default"
                }
                onClick={this.handleSave}
                disabled={!this.isFormValid() || this.state.isSaving || !this.hasAnyChanges()}
              >
                {
                  !this.isFormValid() ? "Fix errors":
                    this.state.isSaving ? "Saving Changes..." :
                      this.hasAnyChanges() ? "Save Changes" :
                        "Saved"
                }
              </Button>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Household Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.household.value.id}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalAddress1" validationState={this.getValidationState("address1")}>
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 1)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter address (line 1)"
                value={this.state.household.value.address1}
                onChange={this.createHandleChange("address1")}
                />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalAddress2" validationState={this.getValidationState("address2")}>
            <Col componentClass={ControlLabel} sm={2}>
              Address (line 2)
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Address (line 2)"
                value={this.state.household.value.address2}
                onChange={this.createHandleChange("address2")}
               />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalCity" validationState={this.getValidationState("city")}>
            <Col componentClass={ControlLabel} sm={2}>
              City
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter City"
                value={this.state.household.value.city}
                onChange={this.createHandleChange("city")}
                />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalState" validationState={this.getValidationState("state")}>
            <Col componentClass={ControlLabel} sm={2}>
              State
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter State"
                value={this.state.household.value.state}
                onChange={this.createHandleChange("state")}
                />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalZip" validationState={this.getValidationState("zip")}>
            <Col componentClass={ControlLabel} sm={2}>
              Zip
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Enter Zip"
                value={this.state.household.value.zip}
                onChange={this.createHandleChange("zip")}
                />
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalIncome" validationState={this.getValidationState("income")}>
            <Col componentClass={ControlLabel} sm={2}>
              Income
            </Col>
            <Col sm={10}>
              { this.income.map( (value) => {
                return (
                  <Radio
                    key={"income-"+value}
                    value={value}
                    checked={this.state.household.value.income==value}
                    onChange={this.createHandleChange("income")}
                    >
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
              <Clients clients={this.state.clients}/>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalNote">
            <Col componentClass={ControlLabel} sm={2}>
              Note
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.household.value.note}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalOldHouseholdId">
            <Col componentClass={ControlLabel} sm={2}>
              Old Household Id
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.household.value.oldHouseholdId}</FormControlStatic>
            </Col>
          </FormGroup>

          <FormGroup controlId="formHorizontalDateEntered">
            <Col componentClass={ControlLabel} sm={2}>
              Date Entered
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.household.value.dateEntered}</FormControlStatic>
            </Col>
          </FormGroup>

           <FormGroup controlId="formHorizontalEnteredBy">
            <Col componentClass={ControlLabel} sm={2}>
              Entered By
            </Col>
            <Col sm={10}>
              <FormControlStatic>{this.state.household.value.enteredBy}</FormControlStatic>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

export default withStyles(s)(HouseholdDetailForm);

