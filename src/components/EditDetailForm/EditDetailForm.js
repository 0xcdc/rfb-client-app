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
import { Button, Col, Glyphicon, Label, Nav, NavItem, Panel, Row, Tab} from 'react-bootstrap';
import Link from '../Link';

class EditDetailForm extends Component {
  constructor(props) {
    super(props);
    let clients = props.household.clients.map( (c) => {
      return clone(c);
    });
    let household = clone(props.household);
    delete household.clients;

    this.handleNewClient = this.handleNewClient.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.updateState = this.updateState.bind(this);

    this.state = {
      household: new TrackingObject(household, this.updateState, null, "updateHousehold", "household"),
      isSaving: false,
      key: "household",
      clients: clients.map( (c) => { return this.newClientTO(c); }),
    };

    this.data = [this.state.household].concat(this.state.clients);
  }

  hasAnyChanges() {
    return this.data.some( (o) => { return o.hasAnyChanges();});
  };

  handleNewClient() {
    let newClient = {
      id: -1,
      householdId: this.state.household.value.id,
      firstName: "",
      lastName: "",
      disabled: "",
      race: "",
      birthYear: "",
      gender: "",
      refugeeImmigrantStatus: "",
      speaksEnglish: "",
      militaryStatus: "",
      ethnicity: "",
      dateEntered: "",
      enteredBy: "",
    };
    let newTO = this.newClientTO(newClient);
    this.data.push(newTO);
    this.state.clients.push(newTO);
    this.setState({ clients: this.state.clients, key: -1});
  }

  handleSave() {
    this.setState({ isSaving: true, });

    var completed = this.data.map( (to) => {
      return to.saveChanges();
    });

    Promise.all(completed).then( () => {
      this.setState( { isSaving: false, });
      this.updateState();
    });
  }

  handleTabSelect(key) {
    this.setState({key});
  }

  newClientTO(client) {
    return new TrackingObject(client, this.updateState, this.isClientValid, "updateClient", "client");
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
        <Tab.Container id='tabs' onSelect={this.handleTabSelect} activeKey={this.state.key}>
          <Row>
            <Col sm={2}>
              <Nav bsStyle="pills" stacked>
                <NavItem eventKey="household">
                  Household
                </NavItem>
                 {
                  this.state.clients.map( (to) => {
                    const c = to.value;
                    let label = [c.firstName, c.lastName].join(" ");
                    return (
                <NavItem key={c.id} eventKey={c.id}>
                  {label}
                </NavItem>);
                  })
                }
              </Nav>
              <Button style={{marginTop: "10px"}} onClick={this.handleNewClient}>
                Add a new client <Glyphicon glyph="plus"/>
              </Button>
            </Col>
            <Col sm={10}>
              <Panel>
                <Tab.Content>
                  <Tab.Pane eventKey="household">
                    <HouseholdDetailForm household={this.state.household}/>
                  </Tab.Pane>
                  {
                    this.state.clients.map( (to) => {
                      const c = to.value;

                      return (
                  <Tab.Pane key={c.id} eventKey={c.id}>
                    <ClientDetailForm client={to}/>
                  </Tab.Pane>);
                    })
                  }
                </Tab.Content>
              </Panel>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }

  updateState() {
    if(this.state.key == -1) {
      //-1 indicates a new client, if there isn't a client w/ an id of -1 then
      //  we'll assume that the last client in the list is the one that was just added
      if(!this.state.clients.find( (e) => {
        return e.value.id == -1;
      })) {
        this.state.key == this.state.clients[this.state.clients.length-1].value.id;
      }
    }

    this.setState({
      household: this.state.household,
      clients: this.state.clients,
      key: this.state.key,
    });
  }
}

export default withStyles(s)(EditDetailForm);

