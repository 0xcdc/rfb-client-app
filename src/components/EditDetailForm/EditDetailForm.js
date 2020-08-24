import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import { Button, Col, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import IdleTimer from 'react-idle-timer';
import { HouseholdWithClientsType } from 'commonPropTypes';

import TrackingObject from '../TrackingObject';
import { stubClient } from '../stubs';
import ClientDetailForm from '../ClientDetailForm';
import HouseholdDetailForm from '../HouseholdDetailForm';
import Link from '../Link';
import ApplicationContext from '../ApplicationContext';
import s from './EditDetailForm.css';

class EditDetailForm extends Component {
  static isClientInvalid(key, value) {
    switch (key) {
      case 'name':
        if (value.length === 0) return 'Name cannot be blank';
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
      return { ...c };
    });
    const household = { ...props.household };
    delete household.clients;

    this.handleClientChange = this.handleClientChange.bind(this);
    this.handleClientDelete = this.handleClientDelete.bind(this);
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
      dataReady: false,
    };

    this.allTOs = [this.householdTO].concat(this.clientTOs);
  }

  componentDidMount() {
    const jsonCalls = [
      '{cities{id value:name}}',
      '{incomeLevels{id value}}',
      '{races{id value}}',
      '{genders{id value}}',
      '{militaryStatuses{id value}}',
      '{ethnicities{id value}}',
      '{yesNos{id value}}',
    ].map(url => this.context.graphQL(url));

    Promise.all(jsonCalls).then(jsons => {
      let newState = { dataReady: true };
      jsons.forEach(json => {
        newState = { ...newState, ...json.data };
      });

      this.setState(newState);
    });
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
      household: { ...this.householdTO.value },
    });
  }

  handleClientChange(obj, prop, value) {
    const i = this.clientTOs.findIndex(c => {
      return c.value.id === obj.id;
    });
    const c = this.clientTOs[i];
    c.value[prop] = value;
    this.clientTOs[i].value = { ...c.value };
    this.setState({
      clients: this.clientTOs.map(clientTO => {
        return clientTO.value;
      }),
    });
  }

  handleClientDelete(obj) {
    const i = this.clientTOs.findIndex(c => {
      return c.value.id === obj.id;
    });
    const deleteFinished = this.context.graphQL(`
      mutation{
        deleteClient(id:${obj.id}) {id}
      }`);
    deleteFinished.then(() => {
      this.clientTOs.splice(i, 1);
      this.setState({
        clients: this.clientTOs.map(clientTO => {
          return clientTO.value;
        }),
        key: 'household',
      });
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
    if (this.hasChanges() && !this.isFormInvalid()) {
      this.setState({ isSaving: true }, this.saveChanges);
    }
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
          let label = c.name;
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
    if (!this.state.dataReady) {
      mainPane = <span />;
    } else if (activeKey === 'household') {
      mainPane = (
        <HouseholdDetailForm
          household={this.state.household}
          onChange={this.handleHouseholdChange}
          getValidationState={key => {
            return this.householdTO.getValidationState(key);
          }}
          cities={this.state.cities}
          incomeLevels={this.state.incomeLevels}
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
          onDelete={this.handleClientDelete}
          getValidationState={key => {
            return clientTO.getValidationState(key);
          }}
          races={this.state.races}
          genders={this.state.genders}
          militaryStatuses={this.state.militaryStatuses}
          ethnicities={this.state.ethnicities}
          yesNos={this.state.yesNos}
        />
      );
    }
    return (
      <div>
        <IdleTimer onIdle={this.handleSave} timeout={5000}>
          {headerInfo}
          <Row>
            <Col sm="2">{selectionColumn}</Col>
            <Col sm="10">{mainPane}</Col>
          </Row>
        </IdleTimer>
      </div>
    );
  }
}

EditDetailForm.contextType = ApplicationContext;

export default withStyles(s)(EditDetailForm);
