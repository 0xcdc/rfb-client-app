/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EditDetailForm.css';
import { clone, stubClient, TrackingObject } from '../common';
import ClientDetailForm from '../ClientDetailForm';
import HouseholdDetailForm from '../HouseholdDetailForm';
import { Button, Col, Glyphicon, Label, Nav, NavItem, Panel, Row, Tab} from 'react-bootstrap';
import Link from '../Link';

class EditDetailForm extends Component {
  static propTypes = {
    household: PropTypes.shape({
      address1: PropTypes.string.isRequired,
      address2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
      income: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
      clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        lastCheckin: PropTypes.string,
        note: PropTypes.string,
      })).isRequired,
    }).isRequired,
  }

  static contextTypes = { graphQL: PropTypes.func.isRequired };

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
      focus: "household",
    };

    this.data = [this.state.household].concat(this.state.clients);
  }

  hasAnyChanges() {
    return this.data.some( (o) => { return o.hasAnyChanges();});
  };

  handleNewClient() {
    let newClient = stubClient(this.state.household.value.id);
    let newTO = this.newClientTO(newClient);
    this.data.push(newTO);
    this.state.clients.push(newTO);
    this.setState({
      clients: this.state.clients,
      key: -1,
      focus: -1,
    });
  }

  handleSave() {
    this.setState({ isSaving: true, });
    var key = this.state.key;

    //first save the household so we get a householdId
    this.state.household.saveChanges(this.context.graphQL).then( () => {

      let completed = this.state.clients.map( (to) => {
        to.value.householdId = this.state.household.value.id;
        let complete= to.saveChanges(this.context.graphQL);
        if(to.value.id == -1) {
          complete = complete.then( () => {
            key = to.value.id;
          });
        }

        return complete;
      });

      Promise.all(completed).then( () => {
        this.setState( { isSaving: false, key, });
        this.updateState();
      });
    });
  }

  handleTabSelect(key) {
    this.setState({
      key,
      focus: key,
    });
  }

  newClientTO(client) {
    return new TrackingObject(client, this.updateState, this.isClientInvalid, "updateClient", "client");
  }

  isClientInvalid(key, value) {
    switch(key) {
      case "firstName":
        if(value.length == 0) {
          return "First Name cannot be blank";
        }
        break;
      case "lastName":
        if(value.length == 0) {
          return "Last Name cannot be blank";
        }
        break;
    }
    return false;
  }

  isFormInvalid() {
    return this.isHouseholdInvalid() ||
           this.data
             .map( (o) => { return o.isInvalid(); })
             .find( (v) => { return v != false }) ||
           false;

  }

  isHouseholdInvalid() {
    if(this.state.clients.length == 0) {
      return "You must have at least one client";
    } else {
      return false;
    }
  }

  render() {
    return (
      <div>
        <h1>
          <Link to="/"><Glyphicon glyph="home"/></Link>
          {" Review Household Information "}
         <Button
            bsStyle={
              this.isFormInvalid() ? "danger" :
                this.state.isSaving ? "info" :
                  this.hasAnyChanges() ? "success" :
                    "default"
            }
            onClick={this.handleSave}
            disabled={(this.isFormInvalid()!=false) || this.state.isSaving || !this.hasAnyChanges()}
          >
            {
              this.isFormInvalid() ? this.isFormInvalid() :
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
              <Button
                style={{marginTop: "10px"}}
                onClick={this.handleNewClient}
                disabled={this.state.clients.some( (to) => {return to.value.id == -1;}) }>
                Add a new client <Glyphicon glyph="plus"/>
              </Button>
            </Col>
            <Col sm={10}>
              <Panel>
                <Tab.Content>
                  <Tab.Pane eventKey="household">
                    <HouseholdDetailForm household={this.state.household} focus={this.state.focus=="household"}/>
                  </Tab.Pane>
                  {
                    this.state.clients.map( (to) => {
                      const c = to.value;

                      return (
                  <Tab.Pane key={c.id} eventKey={c.id}>
                    <ClientDetailForm client={to} focus={this.state.focus==c.id} />
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
    this.setState({
      household: this.state.household,
      clients: this.state.clients,
      key: this.state.key,
      focus: "",
    });
  }
}

export default withStyles(s)(EditDetailForm);

