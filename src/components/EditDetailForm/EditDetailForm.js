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
import s from './EditDetailForm.css';
import { clone, TrackingObject } from '../common';
import ClientDetailForm from '../ClientDetailForm';
import HouseholdDetailForm from '../HouseholdDetailForm';
import { Button, Col, ControlLabel, Form, FormGroup, FormControl, Glyphicon, Radio, Tabs, Tab } from 'react-bootstrap';
import Link from '../Link';

const FormControlStatic = FormControl.Static;

class EditDetailForm extends Component {
  constructor(props) {
    super(props);
    let clients = props.household.clients.map( (c) => {
      return clone(c);
    });
    let household = clone(props.household);
    delete household.clients;

    this.handleSave = this.handleSave.bind(this);
    this.updateState = this.updateState.bind(this);

    this.state = {
      household: new TrackingObject(household, this.updateState),
      isSaving: false,
      clients: clients.map( (c) => { return new TrackingObject(c, this.updateState, this.isClientValid);}),
    };

    this.data = [this.state.household].concat(this.state.clients);
  }

  hasAnyChanges() {
    return this.data.some( (o) => { return o.hasAnyChanges();});
  };

  handleSave() {
    this.setState({ isSaving: true, });

    var completed = this.state.household.saveChanges("updateHousehold", "household");
    completed.then( () => {
      let household = this.state.household;
      this.setState( { household, isSaving: false, });
    });

  }

  isClientValid(key, value) {
    switch(key) {
      case "firstName":
      case "lastName":
        if(value.length == 0) {
          return false;
        }
        break;
    }
    return true;
  }

  isFormValid() {
    return this.data.every( (o) => { return o.isValid(); });
  }

  render() {
    return (
      <div>
        <h1>
          <Link to="/"><Glyphicon glyph="home"/></Link>
          {" Review Household Information "}
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
        </h1>
        <Tabs bsStyle="pills" id="tabs">
          <Tab eventKey='household' title="Household">
            <HouseholdDetailForm household={this.state.household}/>
          </Tab>
          {
            this.state.clients.map( (to) => {
              const c = to.value;
              const name = [c.firstName, c.lastName].join(" ");
              return (
          <Tab key={c.id} eventKey={c.id} title={name}>
            <ClientDetailForm client={to}/>
          </Tab>);
            })
          }
          <Tab key='new' eventKey='new' title={(<div>Add a new client <Glyphicon glyph="plus"/></div>)}/>
        </Tabs>
      </div>
    );
  }

  updateState() {
    this.setState({
      household: this.state.household,
      clients: this.state.clients,
    });
  }
}

export default withStyles(s)(EditDetailForm);

