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

    this.handleSave = this.handleSave.bind(this);
    this.updateState = this.updateState.bind(this);

    this.state = {
      household: new TrackingObject(household, this.updateState, null, "updateHousehold", "household"),
      isSaving: false,
      clients: clients.map( (c) => { return new TrackingObject(c, this.updateState, this.isClientValid, "updateClient", "client");}),
    };

    this.data = [this.state.household].concat(this.state.clients);
  }

  hasAnyChanges() {
    return this.data.some( (o) => { return o.hasAnyChanges();});
  };

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
        <Tab.Container id='tabs' defaultActiveKey="household">
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
          </Col>
          <Col sm={10}>
          <Panel>  <Tab.Content>
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
          {/*<Tab key='new' eventKey='new' title={(<div>Add a new client <Glyphicon glyph="plus"/></div>)}/>*/}
          </Row>
        </Tab.Container>
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

