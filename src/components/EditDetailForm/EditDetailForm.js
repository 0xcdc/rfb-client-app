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

  static clientVariant(trackingObject) {
    if (trackingObject.isInvalid()) {
      return 'danger';
    }
    if (trackingObject.hasChanges()) {
      return 'success';
    }
    return '';
  }

  static propTypes = {
    household: HouseholdWithClientsType.isRequired,
  };

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

    this.allTOs = [this.householdTO].concat(this.clientTOs);
  }

  getSaveState() {
    if (this.isFormInvalid()) return 'danger';
    if (this.state.isSaving) return 'info';
    if (this.hasChanges()) return 'success';
    return 'default';
  }

  getSaveString() {
    if (this.isFormInvalid()) return this.isFormInvalid();
    if (this.state.isSaving) return 'Saving Changes...';
    if (this.hasChanges()) return 'Save Changes';
    return 'Saved';
  }

  static contextType = ApplicationContext;

  canSave() {
    return this.getSaveState() === 'success';
  }

  hasChanges() {
    return this.allTOs.some(o => {
      return o.hasChanges();
    });
  }

  handleNewClient() {
    const newClient = stubClient(this.householdTO.value.id);
    const newTO = EditDetailForm.newClientTO(newClient);
    this.clientTOs.push(newTO);
    this.allTOs.push(newTO);
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

  saveClients(household) {
    const householdID = household.id;
    this.householdTO.value = household;
    const clientSaves = this.clientTOs
      .filter(to => {
        return to.hasChanges();
      })
      .map(to => {
        const clientTO = to;
        clientTO.value.householdId = householdID;
        let clientSave = clientTO.saveChanges(this.context.graphQL);
        clientSave = clientSave.then(client => {
          clientTO.value = client;
        });
        return clientSave;
      });
    return Promise.all(clientSaves);
  }

  saveChanges() {
    let { key } = this.state;
    const selectedClientTO = this.clientTOs.find(to => to.value.id === key);

    let householdSave = null;
    if (this.householdTO.hasChanges() || this.householdTO.value.id === -1) {
      householdSave = this.householdTO.saveChanges(this.context.graphQL);
    } else {
      householdSave = Promise.resolve(this.state.household);
    }

    const clientSaves = householdSave.then(household => {
      return this.saveClients(household);
    });

    clientSaves.finally(() => {
      // if we saved a new client we need to update the selected key to match it's new id
      if (selectedClientTO) {
        key = selectedClientTO.value.id;
      }

      const newState = {
        household: this.householdTO.value,
        isSaving: false,
        key,
        clients: this.clientTOs.map(clientTO => {
          return clientTO.value;
        }),
      };

      this.setState(newState);
    });
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
      this.allTOs
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
    if (this.clientTOs.length === 0) {
      return 'You must have at least one client';
    }
    return false;
  }

  householdVariant() {
    if (this.isHouseholdInvalid() || this.householdTO.isInvalid()) {
      return 'danger';
    }
    if (this.householdTO.hasChanges()) {
      return 'success';
    }
    return '';
  }

  render() {
    const activeKey = this.state.key;
    const headerInfo = (
      <h1>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} />
        </Link>
        <span className={s.title}>Review Household Information</span>
        <Button
          variant={this.getSaveState()}
          onClick={this.handleSave}
          disabled={!this.canSave()}
        >
          {this.getSaveString()}
        </Button>
      </h1>
    );
    const selectionColumn = (
      <ListGroup variant="flush" activeKey={activeKey}>
        <ListGroup.Item
          key="household"
          eventKey="household"
          action
          onClick={() => {
            this.handleTabSelect('household');
          }}
          variant={this.householdVariant()}
        >
          Household
        </ListGroup.Item>
        {this.clientTOs.map(to => {
          const c = to.value;
          let label = `${c.firstName} ${c.lastName}`;
          if (label.length <= 1) label = 'Unnamed Client';
          return (
            <ListGroup.Item
              action
              key={c.id}
              eventKey={c.id}
              onClick={() => {
                this.handleTabSelect(c.id);
              }}
              variant={EditDetailForm.clientVariant(to)}
            >
              {label}
            </ListGroup.Item>
          );
        })}
        <ListGroup.Item
          action
          variant="secondary"
          onClick={this.handleNewClient}
          key="new client button"
          disabled={this.state.clients.some(c => {
            return c.id === -1;
          })}
        >
          Add a new client <FontAwesomeIcon icon={faPlus} />
        </ListGroup.Item>
      </ListGroup>
    );

    let mainPane = null;
    if (activeKey === 'household') {
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
        return to.value.id === activeKey;
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
