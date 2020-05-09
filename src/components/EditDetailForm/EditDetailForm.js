/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  clone,
  stubClient,
  TrackingObject,
  HouseholdWithClientsType,
} from '../common';
import ClientDetailForm from '../ClientDetailForm';
import HouseholdDetailForm from '../HouseholdDetailForm';
import Link from '../Link';
import ApplicationContext from '../ApplicationContext';
import s from './EditDetailForm.css';

class EditDetailForm extends Component {
  static isClientInvalid(key, value) {
    switch (key) {
      case 'firstName':
        if (value.length === 0) return 'First Name cannot be blank';
        break;
      case 'lastName':
        if (value.length === 0) return 'Last Name cannot be blank';
        break;
      default:
        // ignore other keys for now
        break;
    }
    return false;
  }

  static newClientTO(client) {
    return new TrackingObject(
      client,
      EditDetailForm.isClientInvalid,
      'updateClient',
      'client',
    );
  }

  static propTypes = HouseholdWithClientsType;

  constructor(props) {
    super(props);
    const clients = props.household.clients.map(c => {
      return clone(c);
    });
    const household = clone(props.household);
    delete household.clients;

    this.handleClientChange = this.handleClientChange.bind(this);
    this.handleHouseholdChange = this.handleHouseholdChange.bind(this);
    this.handleNewClient = this.handleNewClient.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);

    this.householdTO = new TrackingObject(
      household,
      null,
      'updateHousehold',
      'household',
    );

    this.clientTOs = clients.map(c => {
      return EditDetailForm.newClientTO(c);
    });

    this.state = {
      household: this.householdTO.value,
      isSaving: false,
      key: 'household',
      clients: this.clientTOs.map(clientTO => {
        return clientTO.value;
      }),
    };

    this.data = [this.householdTO].concat(this.clientTOs);
  }

  getSaveState() {
    if (this.isFormInvalid()) return 'danger';
    if (this.state.isSaving) return 'info';
    if (this.hasAnyChanges()) return 'success';
    return 'default';
  }

  getSaveString() {
    if (this.isFormInvalid()) return this.isFormInvalid();
    if (this.state.isSaving) return 'Saving Changes...';
    if (this.hasAnyChanges()) return 'Save Changes';
    return 'Saved';
  }

  static contextType = ApplicationContext;

  canSave() {
    return this.getSaveState() === 'default';
  }

  hasAnyChanges() {
    return this.data.some(o => {
      return o.hasAnyChanges();
    });
  }

  handleNewClient() {
    const newClient = stubClient(this.householdTO.value.id);
    const newTO = EditDetailForm.newClientTO(newClient);
    this.clientTOs.push(newTO);
    this.data.push(newTO);
    this.setState({
      clients: this.clientTOs.map(clientTO => {
        return clientTO.value;
      }),
      key: newClient.id,
    });
  }

  handleHouseholdChange(obj, prop, value) {
    this.householdTO.value[prop] = value;
    this.setState({
      household: clone(this.householdTO.value),
    });
  }

  handleClientChange(obj, prop, value) {
    const i = this.clientTOs.findIndex(c => {
      return c.value.id === obj.id;
    });
    const c = this.clientTOs[i];
    c.value[prop] = value;
    this.clientTOs[i].value = clone(c.value);
    this.setState({
      clients: this.clientTOs.map(clientTO => {
        return clientTO.value;
      }),
    });
  }

  saveChanges() {
    let { key } = this.state;

    // first save the household so we get a householdId
    let householdSave = this.householdTO.saveChanges(this.context.graphQL);
    householdSave = householdSave.then(household => {
      const householdID = household.id;
      this.householdTO.value = household;
      const clientSaves = this.clientTOs.map(to => {
        const clientTO = to;
        clientTO.value.householdId = householdID;
        let clientSave = clientTO.saveChanges(this.context.graphQL);
        clientSave = clientSave.then(client => {
          clientTO.value = client;
          if (clientTO.value.id === -1) {
            key = client.id;
            clientTO.value.id = client.id;
          }
        });
        return clientSave;
      });
      Promise.all(clientSaves).then(() => {
        this.setState({
          household,
          isSaving: false,
          key,
          clients: this.clientTOs.map(clientTO => {
            return clientTO.value;
          }),
        });
      });
    });
    return householdSave;
  }

  handleSave() {
    // set the isSaving flag to true before anything
    this.setState({ isSaving: true }, this.saveChanges);
  }

  handleTabSelect(key) {
    this.setState({
      key,
    });
  }

  isFormInvalid() {
    return (
      this.isHouseholdInvalid() ||
      this.data
        .map(o => {
          return o.isInvalid();
        })
        .find(v => {
          return v !== false;
        }) ||
      false
    );
  }

  isHouseholdInvalid() {
    if (this.state.clients.length === 0) {
      return 'You must have at least one client';
    }
    return false;
  }

  render() {
    const headerInfo = (
      <h1>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        Review Household Information
        <Button
          variant={this.getSaveState()}
          onClick={this.handleSave}
          disabled={this.canSave()}
        >
          {this.getSaveString()}
        </Button>
      </h1>
    );
    const canSwitch = this.getSaveState() !== 'default';
    const selectionColumn = (
      <ListGroup variant="flush" activeKey={this.state.key}>
        <ListGroup.Item
          eventKey="household"
          action
          disabled={canSwitch}
          onClick={() => {
            this.handleTabSelect('household');
          }}
        >
          Household
        </ListGroup.Item>
        {this.state.clients.map(c => {
          let label = `${c.firstName} ${c.lastName}`;
          if (label.length <= 1) label = 'Unnamed Client';
          return (
            <ListGroup.Item
              action
              disabled={canSwitch}
              eventKey={c.id}
              onClick={() => {
                this.handleTabSelect(c.id);
              }}
            >
              {label}
            </ListGroup.Item>
          );
        })}
        <ListGroup.Item
          action
          variant="success"
          onClick={this.handleNewClient}
          disabled={
            canSwitch ||
            this.state.clients.some(c => {
              return c.id === -1;
            })
          }
        >
          Add a new client <FontAwesomeIcon icon={faPlus} />
        </ListGroup.Item>
      </ListGroup>
    );

    let mainPane = null;
    if (this.state.key === 'household') {
      mainPane = (
        <HouseholdDetailForm
          household={this.state.household}
          onChange={this.handleHouseholdChange}
          getValidationState={key => {
            return this.householdTO.getValidationState(key);
          }}
        />
      );
    } else {
      const clientTO = this.clientTOs.find(to => {
        return to.value.id === this.state.key;
      });
      const client = clientTO.value;

      mainPane = (
        <ClientDetailForm
          client={client}
          onChange={this.handleClientChange}
          getValidationState={key => {
            return clientTO.getValidationState(key);
          }}
        />
      );
    }

    return (
      <div>
        {headerInfo}
        <Row>
          <Col sm="2">{selectionColumn}</Col>
          <Col sm="10">{mainPane}</Col>
        </Row>
      </div>
    );
  }
}

EditDetailForm.contextType = ApplicationContext;

export default withStyles(s)(EditDetailForm);
