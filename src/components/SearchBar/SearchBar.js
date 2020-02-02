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
import {
  Button,
  Col,
  Glyphicon,
  Grid,
  Modal,
  Pagination,
  Row,
} from 'react-bootstrap';
import Clients from '../Clients';
import Visits from '../Visits';
import Link from '../Link';
import history from '../../history';
import ApplicationContext from '../ApplicationContext';
import s from './SearchBar.css';

function alreadyVisited(client) {
  const daysSinceLastVisit =
    new Date(formatDate()) - new Date(client.lastVisit);
  return daysSinceLastVisit < 3 * 24 * 60 * 60 * 1000;
}

function buildLetterHistogram(value) {
  const arr = new Array(27);
  arr.fill(0);
  const lv = value.toLowerCase();
  const littleA = 'a'.charCodeAt(0);
  for (let i = 0; i < lv.length; i += 1) {
    let c = lv.charCodeAt(i) - littleA;
    if (c < 0 || c >= 26) {
      c = 26;
    }
    arr[c] += 1;
  }

  return arr;
}

function date2Obj(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return {
    year,
    month,
    day,
  };
}

function formatDate(date) {
  let d = date;
  if (!d) d = new Date();
  if (!d.year) d = date2Obj(d);
  return [d.year, d.month, d.day].join('-');
}

function getToday() {
  return date2Obj(new Date());
}

function getPageNumbers(page, pages) {
  let start = Math.floor(page / 10) * 10 + 1;
  if (start > page) start -= 10;
  const end = Math.min(start + 9, pages);
  const result = [];
  for (let i = start; i <= end; i += 1) {
    result.push(i);
  }

  return result;
}

function shortDelay(msec, value) {
  const delay = new Promise(resolve => {
    window.setTimeout(() => {
      resolve(value);
    }, msec);
  });
  return delay;
}

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

  constructor(props) {
    super(props);

    this.textBox = React.createRef();

    this.clients = this.props.clients.map(client => {
      const fullName = `${client.firstName.toLowerCase()} ${client.lastName.toLowerCase()}`;
      const c = client;
      c.nameParts = fullName.split(' ');
      c.histogram = buildLetterHistogram(fullName);
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

  componentDidMount() {
    const pageTuple = this.currentPageClients('', 0);
    if (pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, 'componentDidMount');
    }
  }

  componentDidUpdate() {
    this.textBox.current.focus();
  }

  handleClientSelect = (client, index, src) => {
    // console.log(client, index);
    this.loadVisits(client, `clientSelect: ${src}`);
    this.setState(prevState => ({
      selectedIndex: Math.floor(prevState.selectedIndex / 10) * 10 + index,
    }));
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
      this.loadVisits(pageTuple.selectedClient, 'handleDeleteVisit');
    });
  }

  handleOnKeyDown(e) {
    const { selectedIndex } = this.state;
    let newIndex = selectedIndex;
    switch (e.key) {
      case 'ArrowDown':
        newIndex += 1;
        break;
      case 'ArrowUp':
        newIndex -= 1;
        break;
      case 'Enter':
        this.handleCheckIn();
        break;
      case 'e':
        if (e.ctrlKey) {
          e.preventDefault();
          const pageTuple = this.currentPageClients(
            this.state.filter,
            this.state.selectedIndex,
          );
          history.push(`/households/${pageTuple.selectedClient.householdId}`);
        }
        break;
      default:
        // console.log(e.key);
        break;
    }
    if (newIndex !== selectedIndex) {
      const pageTuple = this.currentPageClients(this.state.filter, newIndex);
      if (pageTuple.selectedIndex !== selectedIndex) {
        this.setState({ selectedIndex: pageTuple.selectedIndex });
        this.loadVisits(pageTuple.selectedClient, 'handleOnKeyDown');
      }
    }
  }

  handlePageSelect(pageNumber) {
    const currentPageNumber = Math.floor(this.state.selectedIndex / 10) + 1;
    const newSelectedIndex =
      10 * (pageNumber - currentPageNumber) + this.state.selectedIndex;

    this.setState(prevState => {
      const pageTuple = this.currentPageClients(
        prevState.filter,
        newSelectedIndex,
      );
      if (pageTuple.selectedClient) {
        this.loadVisits(pageTuple.selectedClient, 'pageNumber');
      }

      return {
        selectedIndex: pageTuple.selectedIndex,
      };
    });
  }

  handleSearchBoxChange(e) {
    const filter = e.target.value;
    const pageTuple = this.currentPageClients(filter, 0);

    this.setState({
      filter,
      selectedIndex: 0,
      visits: [],
    });

    if (pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, 'searchBoxChange');
    }
  }

  currentPageClients(filter, selectedIndex) {
    const lfilter = filter.toLowerCase();
    let filteredClients = this.clients;

    if (lfilter.length > 0) {
      const filterParts = lfilter.split(' ');

      filteredClients = filteredClients.map(client => {
        let exactMatch = 0;
        const { nameParts } = client;
        filterParts.forEach(filterPart => {
          if (
            nameParts.some(namePart => {
              return namePart.startsWith(filterPart);
            })
          ) {
            exactMatch += filterPart.length;
          }
        });

        const filterHist = buildLetterHistogram(filter);
        // we want to do a merge join of chars and the search string
        // and calculate count of extra a missing characters
        let missing = 0;
        let extra = 0;
        let matched = 0;

        for (let i = 0; i < filterHist.length; i += 1) {
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
      filteredClients = filteredClients.filter(client => {
        return client.matched > client.extra;
      });
    }

    filteredClients.sort((a, b) => {
      let cmp = 0;
      if (lfilter.length > 0) {
        cmp = -(a.exactMatch - b.exactMatch);
        if (cmp !== 0) return cmp;
        cmp = -(a.matched - b.matched);
        if (cmp !== 0) return cmp;
        cmp = a.extra - b.extra;
        if (cmp !== 0) return cmp;
        cmp = a.missing - b.missing;
        if (cmp !== 0) return cmp;
      }
      cmp = a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
      if (cmp !== 0) return cmp;
      cmp = a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
      return cmp;
    });

    // make sure that the selectedIndex falls in the current range of clients
    let filteredIndex = Math.min(filteredClients.length - 1, selectedIndex);
    filteredIndex = Math.max(0, filteredIndex);

    const pages = Math.floor((filteredClients.length - 1) / 10) + 1;
    const page = Math.floor(filteredIndex / 10) + 1;

    const lastItem = page * 10;
    const firstItem = lastItem - 10;
    const currentPageClients = filteredClients.slice(firstItem, lastItem);

    const selectedClient =
      filteredIndex < filteredClients.length
        ? filteredClients[filteredIndex]
        : null;

    return {
      page,
      pages,
      currentPageClients,
      filteredIndex,
      selectedClient,
    };
  }

  handleCheckIn() {
    const pageTuple = this.currentPageClients(
      this.state.filter,
      this.state.selectedIndex,
    );
    const { selectedClient } = pageTuple;
    if (selectedClient && !alreadyVisited(selectedClient)) {
      this.setState({ showModal: 'pending' });
      const today = getToday();
      const query = `mutation{recordVisit(
        householdId: ${selectedClient.householdId},
        year:${today.year},
        month:${today.month},
        day:${today.day}){date}}`;

      const dataAvailable = this.context.graphQL(query);

      dataAvailable
        .then(() => {
          return shortDelay(700);
        })
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

  handleModalOnExited() {
    const searchBar = this.textBox.current;
    searchBar.focus();
    searchBar.setSelectionRange(0, searchBar.value.length);
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  loadVisits(client) {
    const query = `{visitsForHousehold(householdId:${client.householdId}){id date}}`;
    return this.context.graphQL(query).then(json => {
      const visits = json.data.visitsForHousehold;

      const lastVisit = visits.reduce((acc, cv) => {
        return acc == null || cv.date > acc ? cv.date : acc;
      }, null);

      this.clients = this.clients.map(c => {
        const rv = c;
        if (rv.householdId === client.householdId) {
          rv.lastVisit = lastVisit;
        }
        return rv;
      });

      this.setState({
        visits,
      });
    });
  }

  render() {
    const pageTuple = this.currentPageClients(
      this.state.filter,
      this.state.selectedIndex,
    );
    const { currentPageClients, page, pages, selectedClient } = pageTuple;
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
                Client:<strong>{selectedClientName}</strong>
                <br />
                Household size: <strong>{selectedClient.householdSize}</strong>
                <br />
                Card color: <strong>{selectedClient.cardColor}</strong>
                <span
                  style={{
                    backgroundColor: selectedClient.cardColor,
                    color:
                      selectedClient.cardColor === 'yellow' ? 'black' : 'white',
                    padding: '5px 5px 2px 5px',
                    margin: '5px',
                  }}
                >
                  <Glyphicon glyph="th-list" />
                </span>
                <br />
                {this.state.showModal === 'pending' && (
                  <Button bsStyle="info" bsSize="large" block>
                    <Glyphicon glyph="refresh" className={s.spinning} />{' '}
                    Recording visit...
                  </Button>
                )}
                {this.state.showModal === 'completed' && (
                  <Button bsStyle="primary" bsSize="large" block>
                    <Glyphicon glyph="ok-circle" /> Finished
                  </Button>
                )}
              </div>
            )}
          </Modal.Title>
        </Modal.Body>
      </Modal>
    );

    const clientAlreadyVisited =
      selectedClient && alreadyVisited(selectedClient);

    const mainLayout = (
      <Grid>
        <Row>
          <Col xs={7}>
            <input
              ref={this.textBox}
              className={s.searchBar}
              type="text"
              onChange={this.handleSearchBoxChange}
              onKeyDown={this.handleOnKeyDown}
              placeholder="Enter any part of the clients name to filter"
            />
            <Clients
              clients={currentPageClients}
              selectedClientId={selectedClient ? selectedClient.id : null}
              onClientSelect={(client, index) => {
                this.handleClientSelect(client, index, 'onClientSelect');
              }}
              onClientDoubleClick={this.handleClientDoubleClick}
              showSelection
            />
            <Pagination>
              <Pagination.Prev
                onClick={() => {
                  this.handlePageSelect(Math.max(1, page - 10));
                }}
              />
              {getPageNumbers(page, pages).map(i => {
                return (
                  <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => {
                      this.handlePageSelect(i);
                    }}
                  >
                    {i}
                  </Pagination.Item>
                );
              })}
              <Pagination.Next
                onClick={() => {
                  this.handlePageSelect(Math.min(pages, page + 10));
                }}
              />
            </Pagination>
          </Col>
          <Col xs={4}>
            <Button
              bsSize="lg"
              disabled={selectedClient ? clientAlreadyVisited : true}
              bsStyle={clientAlreadyVisited ? 'danger' : 'primary'}
              onClick={this.handleCheckIn}
            >
              {clientAlreadyVisited
                ? 'Client already visited'
                : `Check-in ${selectedClientName} `}
              <Glyphicon glyph="check" />
            </Button>
            <br />
            <Link to="/households/-1">
              Register a new household <Glyphicon glyph="plus" />
            </Link>
            <Visits
              visits={this.state.visits}
              onDeleteVisit={this.handleDeleteVisit}
            />
          </Col>
        </Row>
      </Grid>
    );

    return (
      <div className={s.root}>
        {modal}
        {mainLayout}
      </div>
    );
  }
}

SearchBar.contextType = ApplicationContext;

export default withStyles(s)(SearchBar);
