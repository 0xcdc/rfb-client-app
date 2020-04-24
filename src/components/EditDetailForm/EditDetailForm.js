/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Col, Nav, Row, Tab } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import { clone, stubClient, TrackingObject } from '../common';
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

  static propTypes = {
    household: PropTypes.shape({
      address1: PropTypes.string.isRequired,
      address2: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      zip: PropTypes.string.isRequired,
      income: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
      clients: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          firstName: PropTypes.string.isRequired,
          lastName: PropTypes.string.isRequired,
          householdId: PropTypes.number.isRequired,
          lastCheckin: PropTypes.string,
          note: PropTypes.string,
        }),
      ).isRequired,
    }).isRequired,
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
      focus: 'household',
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

  handleSave() {
    this.setState({ isSaving: true }, () => {
      let { key } = this.state;

      // first save the household so we get a householdId
      let future = this.householdTO.saveChanges(this.context.graphQL);
      future = future.then(household => {
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
      return future;
    });
  }

  handleTabSelect(key) {
    this.setState({
      key,
      focus: key,
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
    return (
      <div>
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
        <Tab.Container
          id="tabs"
          onSelect={this.handleTabSelect}
          activeKey={this.state.key}
        >
          <Row>
            <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Link eventKey="household">Household</Nav.Link>
                {this.state.clients.map(c => {
                  let label = `${c.firstName} ${c.lastName}`;
                  if (label.length <= 1) label = 'Unnamed Client';
                  return (
                    <Nav.Link key={c.id} eventKey={c.id}>
                      {label}
                    </Nav.Link>
                  );
                })}
              </Nav>
              <Button
                style={{ marginTop: '10px' }}
                onClick={this.handleNewClient}
                disabled={this.state.clients.some(c => {
                  return c.id === -1;
                })}
              >
                Add a new client <FontAwesomeIcon icon={faPlus} />
              </Button>
            </Col>
            <Col sm={10}>
              <Tab.Content>
                <Tab.Pane eventKey="household">
                  <HouseholdDetailForm
                    household={this.state.household}
                    focus={this.state.focus === 'household'}
                    onChange={this.handleHouseholdChange}
                    getValidationState={key => {
                      return this.householdTO.getValidationState(key);
                    }}
                  />
                </Tab.Pane>
                {this.clientTOs.map(to => {
                  const c = to.value;
                  return (
                    <Tab.Pane key={c.id} eventKey={c.id}>
                      <ClientDetailForm
                        client={c}
                        focus={this.state.focus === c.id}
                        onChange={this.handleClientChange}
                        getValidationState={key => {
                          return to.getValidationState(key);
                        }}
                      />
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  }
}

EditDetailForm.contextType = ApplicationContext;

export default withStyles(s)(EditDetailForm);
