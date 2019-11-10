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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  Button,
  Col,
  Dropdown,
  MenuItem,
  Modal,
  Pagination,
  Row,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import s from './SearchBar.css';
import Clients from '../Clients';
import Visits from '../Visits';
import Link from '../Link';
import history from '../../history';

class SearchBar extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        householdSize: PropTypes.number.isRequired,
        cardColor: PropTypes.string.isRequired,
        lastCheckin: PropTypes.string,
        note: PropTypes.string,
      }),
    ).isRequired,
  };

  static contextTypes = { graphQL: PropTypes.func.isRequired };

  constructor(props) {
    super(props);

    this.clients = this.props.clients.map(c => {
      const fullName = `${c.firstName.toLowerCase()} ${c.lastName.toLowerCase()}`;
      c.nameParts = fullName.split(' ');
      c.histogram = this.buildLetterHistogram(fullName);
      return c;
    });

    this.state = {
      filter: '',
      visits: [],
      selectedIndex: 0,
      showModal: false,
    };

    this.handleCheckIn = this.handleCheckIn.bind(this);
    this.handleDeleteVisit = this.handleDeleteVisit.bind(this);
    this.handleModalOnExited = this.handleModalOnExited.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);

    this.hideModal = this.hideModal.bind(this);
  }

  alreadyVisited(client) {
    const daysSinceLastVisit =
      new Date(this.formatDate()) - new Date(client.lastVisit);
    return daysSinceLastVisit < 3 * 24 * 60 * 60 * 1000;
  }

  buildLetterHistogram(value) {
    const arr = new Array(27);
    arr.fill(0);
    value = value.toLowerCase();
    const littleA = 'a'.charCodeAt(0);
    for (let i = 0; i < value.length; i++) {
      let v = value.charCodeAt(i) - littleA;
      if (v < 0 || v >= 26) {
        v = 26;
      }
      arr[v]++;
    }

    return arr;
  }

  /* componentDidMount() {
    var pageTuple = this.currentPageClients("", 0);
    if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, "componentDidMount");
    }
  } */

  /* componentDidUpdate() {
    this.refs.clientFilterText.focus();
  } */

  currentPageClients(filter, selectedIndex) {
    filter = filter.toLowerCase();
    let filteredClients = this.clients;

    if (filter.length > 0) {
      const filterParts = filter.split(' ');

      filteredClients = filteredClients.map(client => {
        let exactMatch = 0;
        const nameParts = client.nameParts;
        filterParts.forEach(filterPart => {
          if (nameParts.some(namePart => namePart.startsWith(filterPart))) {
            exactMatch += filterPart.length;
          }
        });

        const filterHist = this.buildLetterHistogram(filter);
        // we want to do a merge join of chars and the search string
        // and calculate count of extra a missing characters
        let missing = 0;
        let extra = 0;
        let matched = 0;

        for (let i = 0; i < filterHist.length; i++) {
          const v = filterHist[i] - client.histogram[i];
          if (v <= 0) {
            missing -= v; // v is negative, so this is addition
            matched += filterHist[i];
          } else {
            // (v > 0)
            extra += v;
            matched += client.histogram[i];
          }
        }

        Object.assign(client, {
          missing,
          extra,
          matched,
          exactMatch,
        });

        return client;
      });

      // we want at least one character to match
      filteredClients = filteredClients.filter(
        client => client.matched > client.extra,
      );
    }

    filteredClients.sort((a, b) => {
      let cmp = 0;
      if (filter.length > 0) {
        cmp = -(a.exactMatch - b.exactMatch);
        if (cmp != 0) return cmp;
        cmp = -(a.matched - b.matched);
        if (cmp != 0) return cmp;
        cmp = a.extra - b.extra;
        if (cmp != 0) return cmp;
        cmp = a.missing - b.missing;
        if (cmp != 0) return cmp;
      }
      cmp = a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
      if (cmp != 0) return cmp;
      cmp = a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
      return cmp;
    });

    // make sure that the selectedIndex falls in the current range of clients
    selectedIndex = Math.min(filteredClients.length - 1, selectedIndex);
    selectedIndex = Math.max(0, selectedIndex);

    const pages = Math.floor((filteredClients.length - 1) / 10) + 1;
    const page = Math.floor(selectedIndex / 10) + 1;

    const lastItem = page * 10;
    const firstItem = lastItem - 10;
    const currentPageClients = filteredClients.slice(firstItem, lastItem);

    const selectedClient =
      selectedIndex < filteredClients.length
        ? filteredClients[selectedIndex]
        : null;

    return {
      page,
      pages,
      currentPageClients,
      selectedIndex,
      selectedClient,
    };
  }

  date2Obj(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
      year,
      month,
      day,
    };
  }

  obj2Date(obj) {
    return new Date(this.formatDate(obj));
  }

  formatDate(date) {
    if (!date) date = new Date();
    if (!date.year) date = this.date2Obj(date);
    return [date.year, date.month, date.day].join('-');
  }

  getToday() {
    return this.date2Obj(new Date());
  }

  handleCheckIn() {
    const pageTuple = this.currentPageClients(
      this.state.filter,
      this.state.selectedIndex,
    );
    const selectedClient = pageTuple.selectedClient;
    if (selectedClient && !this.alreadyVisited(selectedClient)) {
      this.setState({ showModal: 'pending' });
      const today = this.getToday();
      const query = `mutation{recordVisit(
        householdId: ${selectedClient.householdId},
        year:${today.year},
        month:${today.month},
        day:${today.day}){date}}`;

      const dataAvailable = this.context.graphQL(query);

      function shortDelay(msec, value) {
        const delay = new Promise((resolve, reject) => {
          window.setTimeout(() => {
            resolve(value);
          }, msec);
        });
        return delay;
      }

      dataAvailable
        .then(() => shortDelay(700))
        .then(() => {
          this.loadVisits(selectedClient, 'handleCheckIn');
        })
        .then(() => {
          this.setState({ showModal: 'completed' });
          return shortDelay(1000);
        })
        .then(() => {
          this.hideModal();
        });
    }
  }

  handleClientSelect = (client, index, src) => {
    // console.log(client, index);
    this.loadVisits(client, `clientSelect:${src}`);
    const newSelectedIndex =
      Math.floor(this.state.selectedIndex / 10) * 10 + index;
    this.setState({
      selectedIndex: newSelectedIndex,
    });
  };

  handleClientDoubleClick = (client, index) => {
    this.handleClientSelect(client, index, 'doubleClick');
    this.handleCheckIn();
  };

  handleDeleteVisit(id) {
    const query = `mutation{deleteVisit(id:${id}) {id}}`;
    const dataAvailable = this.context.graphQL(query);
    dataAvailable.then(() => {
      const pageTuple = this.currentPageClients(
        this.state.filter,
        this.state.selectedIndex,
      );
      const selectedClient = pageTuple.selectedClient;
      this.loadVisits(selectedClient, 'handleDeleteVisit');
    });
  }

  handleOnKeyDown(e) {
    const selectedIndex = this.state.selectedIndex;
    let newIndex = selectedIndex;
    switch (e.key) {
      case 'ArrowDown':
        newIndex++;
        break;
      case 'ArrowUp':
        newIndex--;
        break;
      case 'Enter':
        this.handleCheckIn();
        break;
      case 'e':
        if (e.ctrlKey) {
          e.preventDefault();
          var pageTuple = this.currentPageClients(
            this.state.filter,
            this.state.selectedIndex,
          );
          const selectedClient = pageTuple.selectedClient;
          history.push(`/households/${selectedClient.householdId}`);
        }
        break;
      default:
        // console.log(e.key);
        break;
    }
    if (newIndex != selectedIndex) {
      var pageTuple = this.currentPageClients(this.state.filter, newIndex);
      if (pageTuple.selectedIndex != selectedIndex) {
        this.setState({ selectedIndex: pageTuple.selectedIndex });
        this.loadVisits(pageTuple.selectedClient, 'handleOnKeyDown');
      }
    }
  }

  handlePageSelect(pageNumber) {
    const currentPageNumber = Math.floor(this.state.selectedIndex / 10) + 1;
    const newSelectedIndex =
      10 * (pageNumber - currentPageNumber) + this.state.selectedIndex;
    const pageTuple = this.currentPageClients(
      this.state.filter,
      newSelectedIndex,
    );
    if (pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, 'pageNumber');
    }

    this.setState({
      selectedIndex: pageTuple.selectedIndex,
    });
  }

  handleSeachBoxChange = event => {
    const filter = event.target.value;
    const pageTuple = this.currentPageClients(filter, 0);

    this.setState({
      filter,
      selectedIndex: 0,
      visits: [],
    });

    if (pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, 'searchBoxChange');
    }
  };

  handleModalOnExited() {
    const searchBar = this.refs.clientFilterText;
    searchBar.focus();
    searchBar.setSelectionRange(0, searchBar.value.length);
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  loadVisits(client, src) {
    const query = `{visitsForHousehold(householdId: ${
      client.householdId
    }){id date}}`;
    const dataAvailable = this.context.graphQL(query);
    dataAvailable.then(json => {
      const visits = json.data.visitsForHousehold;

      const lastVisit = visits.reduce(
        (acc, cv) => (acc == null || cv.date > acc ? cv.date : acc),
        null,
      );

      this.clients.forEach(c => {
        if (c.householdId == client.householdId) {
          c.lastVisit = lastVisit;
        }
      });

      this.setState({
        visits,
      });
    });

    return dataAvailable;
  }

  render() {
    const pageTuple = this.currentPageClients(
      this.state.filter,
      this.state.selectedIndex,
    );
    const currentPageClients = pageTuple.currentPageClients;
    const page = pageTuple.page;
    const pages = pageTuple.pages;
    const selectedClient = pageTuple.selectedClient;
    const selectedClientName = selectedClient
      ? `${selectedClient.firstName} ${selectedClient.lastName}`
      : '';

    const modal = (
      <Modal
        bsSize="small"
        onKeyDown={this.hideModal}
        show={this.state.showModal && true}
        onHide={this.hideModal}
        onExited={this.handleModalOnExited}
      >
        <Modal.Body>
          <Modal.Title>
            {!selectedClient ? (
              'I expected a client to be selected'
            ) : (
              <div>
                Client:
                <strong>{selectedClientName}</strong>
                <br />
                Household size: <strong>{selectedClient.householdSize}</strong>
                <br />
                Card color: <strong>{selectedClient.cardColor}</strong>
                <span
                  style={{
                    backgroundColor: selectedClient.cardColor,
                    color:
                      selectedClient.cardColor == 'yellow' ? 'black' : 'white',
                    padding: '5px 5px 2px 5px',
                    margin: '5px',
                  }}
                >
                  <FontAwesomeIcon icon="th-list" />
                </span>
                <br />
                {this.state.showModal == 'pending' && (
                  <Button bsStyle="info" bsSize="large" block>
                    <FontAwesomeIcon icon="refresh" className={s.spinning} />{' '}
                    Recording visit...
                  </Button>
                )}
                {this.state.showModal == 'completed' && (
                  <Button bsStyle="primary" bsSize="large" block>
                    <FontAwesomeIcon icon="ok-circle" /> Finished
                  </Button>
                )}
              </div>
            )}
          </Modal.Title>
        </Modal.Body>
      </Modal>
    );

    const alreadyVisited =
      selectedClient && this.alreadyVisited(selectedClient);

    function getPageNumbers(page, pages) {
      let start = Math.floor(page / 10) * 10 + 1;
      if (start > page) {
        start -= 10;
      }
      const end = Math.min(start + 9, pages);
      const result = [];
      for (let i = start; i <= end; i++) {
        result.push(i);
      }

      return result;
    }

    const mainLayout = (
      <div>
        testing
        {/* <Grid>
        <Row>
          <Col xs={7}>
            <input
              ref="clientFilterText"
              className={s.searchBar}
              type="text"
              onChange={this.handleSeachBoxChange}
              autoFocus
              onKeyDown={this.handleOnKeyDown}
              placeholder="Enter any part of the clients name to filter"/>
            <Clients
              clients={currentPageClients}
              selectedClientId={selectedClient ? selectedClient.id : null}
              onClientSelect={(client, index) => {this.handleClientSelect(client, index, "onClientSelect")}}
              onClientDoubleClick={this.handleClientDoubleClick}
              showSelection/>
            <Pagination>
              <Pagination.Prev onClick={ () => {this.handlePageSelect(Math.max(1, page-10));}}/>
              {getPageNumbers(page, pages).map( (i) => {
                 return (<Pagination.Item key={i} active={i==page} onClick={() => { this.handlePageSelect(i) }}>{i}</Pagination.Item>);} )
              }
              <Pagination.Next onClick={ () => { this.handlePageSelect(Math.min(pages, page+10));}}/>
            </Pagination>
          </Col>
          <Col xs={4}>
            <Button
              bsSize="lg"
              disabled={selectedClient ? alreadyVisited : true }
              bsStyle={alreadyVisited ? "danger" : "primary"}
              onClick={this.handleCheckIn}>
                { !selectedClient ?
                "Check-in Client" : alreadyVisited ?
                  "Client already visited" :
                  "Check-in " + selectedClientName }
                {" "}<FontAwesomeIcon icon="check"/>
            </Button>
            <br/>
            <Link to="/households/-1">Register a new household <FontAwesomeIcon icon="plus"/></Link>
            <Visits visits={this.state.visits} onDeleteVisit={this.handleDeleteVisit}/>
          </Col>
        </Row>
      </Grid> */}
      </div>
    );

    return (
      <div className={s.root}>
        {modal}
        {mainLayout}
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);
