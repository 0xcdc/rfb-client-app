/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react';
import fetch from '../../core/fetch';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBar.css';
import Clients from '../Clients';
import Visits from '../Visits';
import Link from '../Link';
import { Button, Col, Glyphicon, Grid, Modal, Pagination, Row } from 'react-bootstrap';

class SearchBar extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        householdSize: PropTypes.number.isRequired,
        cardColor: PropTypes.string.isRequired,
      })).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      visits: [],
      selectedIndex: 0,
      showModal: false,
    };

    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleCheckIn = this.handleCheckIn.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleModalOnExited = this.handleModalOnExited.bind(this);
    this.handleDeleteVisit = this.handleDeleteVisit.bind(this);
  }

  componentDidMount() {
    var pageTuple = this.currentPageClients("", 0);
    if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, "componentDidMount");
    }
  }

  componentDidUpdate() {
    this.refs.clientFilterText.focus();
  }

  currentPageClients(filter, selectedIndex) {
    var searchString = filter;
    var terms = searchString.split(' ');
    var filteredClients = this.props.clients;
    while(terms.length > 0) {
        var term = terms.pop().toLowerCase();
        filteredClients = filteredClients.filter( (client) => {
          return client.firstName.toLowerCase().includes(term) ||
                 client.lastName.toLowerCase().includes(term);
        })
    }

    filteredClients.sort( (a, b) => {
      var lCmp = a.lastName.localeCompare(b.lastName);
      if(lCmp != 0) return lCmp;
      return a.firstName.localeCompare(b.firstName);
    });

    //make sure that the selectedIndex falls in the current range of clients
    selectedIndex = Math.min(filteredClients.length - 1, selectedIndex);
    selectedIndex = Math.max(0, selectedIndex);


    var pages = Math.floor((filteredClients.length - 1) / 10) + 1;
    var page = Math.floor(selectedIndex / 10) + 1;

    var lastItem = page * 10;
    var firstItem = lastItem - 10;
    var currentPageClients = filteredClients.slice(firstItem, lastItem);

    var selectedClient = (selectedIndex < filteredClients.length ? filteredClients[selectedIndex] : null);

    return {
      page,
      pages,
      currentPageClients,
      selectedIndex,
      selectedClient,
    };
  }

  handleCheckIn() {
    var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
    var selectedClient = pageTuple.selectedClient;
    if(selectedClient) {
      this.setState({showModal: "pending"});
      let query = 'mutation{recordVisit(householdId: ' + selectedClient.householdId + '){date}}'
      let dataAvailable = this.simpleFetch(query);

      function shortDelay(msec, value) {
        var delay = new Promise( (resolve, reject) => {
          window.setTimeout( () => { resolve(value); }, msec);
        });
        return delay;
      }

      var completed = Promise.all([dataAvailable, shortDelay(700)]).then( (values) => {
        this.setState({
          showModal: "completed",
        });
        return shortDelay(1000, values[0].data.recordVisit);
      }).then( (value) => {
        this.hideModal();
        this.loadVisits(selectedClient, "handleCheckIn");
     });
    }
  }


  handleClientSelect = (client, index, src) => {
    this.loadVisits(client, "clientSelect:" + src);
    var newSelectedIndex = Math.floor(this.state.selectedIndex / 10) * 10 + index;
    this.setState({
      selectedIndex: newSelectedIndex,
    });
  }

  handleClientDoubleClick = (client, index) => {
    this.handleClientSelect(client, index, "doubleClick");
    this.handleCheckIn();
  }

  handleDeleteVisit(id) {
    console.log(id);
    let query = "mutation{deleteVisit(id:" + id + ") {id}}";
    let dataAvailable = this.simpleFetch(query);
    dataAvailable.then(() => {
      var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
      var selectedClient = pageTuple.selectedClient;
      this.loadVisits(selectedClient, "handleDeleteVisit");
    });
  }

  handleOnKeyDown(e) {
    var selectedIndex = this.state.selectedIndex;
    var newIndex = selectedIndex;
    switch(e.key) {
      case "ArrowDown":
        newIndex++;
        break;
      case "ArrowUp":
        newIndex--;
        break;
      case "Enter":
        this.handleCheckIn();
        break;
      default:
        //console.log(e.key);
        break;
    }
    if(newIndex != selectedIndex) {
      var pageTuple = this.currentPageClients(this.state.filter, newIndex);
      if(pageTuple.selectedIndex != selectedIndex) {
        this.setState({ selectedIndex: pageTuple.selectedIndex});
        this.loadVisits(pageTuple.selectedClient, "handleOnKeyDown");
      }
    }
  }

  handlePageSelect = (pageNumber) => {
    var currentPageNumber = Math.floor(this.state.selectedIndex / 10) + 1;
    var newSelectedIndex = 10 * (pageNumber - currentPageNumber) + this.state.selectedIndex;
    var pageTuple = this.currentPageClients(this.state.filter, newSelectedIndex);
    if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, "pageNumber");
    }

    this.setState({
      selectedIndex: pageTuple.selectedIndex,
    });
  }

  handleSeachBoxChange = (event) => {
    var filter = event.target.value;
    var pageTuple = this.currentPageClients(filter, 0);

    this.setState( {
      filter: filter,
      selectedIndex: 0,
      visits: [],
    } );

   if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient, "searchBoxChange");
    }
  }

  hideModal() {
    this.setState({showModal: false});
  }

  handleModalOnExited() {
    var searchBar = this.refs.clientFilterText;
    searchBar.focus();
    searchBar.setSelectionRange(0, searchBar.value.length);
  }

  loadVisits(client, src) {
    //console.log(src);
    let query = '{visitsForHousehold(householdId: ' + client.householdId + '){id date}}';
    let dataAvailable = this.simpleFetch(query);
    dataAvailable.then( (json) => {
      this.setState({
        visits: json.data.visitsForHousehold,
      });
    })
  }

  simpleFetch(query) {
    return fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
      credentials: 'include',
    }).then( (response) => {
      return response.json();
    });
  }

  render() {
    var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
    var currentPageClients = pageTuple.currentPageClients;
    var page = pageTuple.page;
    var pages = pageTuple.pages;
    var selectedClient = pageTuple.selectedClient;
    var selectedClientName = selectedClient ? selectedClient.firstName + " " + selectedClient.lastName : "";

    return (
      <div className={s.root}>
        <Modal
          bsSize="small"
          onKeyDown={this.hideModal}
          show={this.state.showModal && true}
          onHide={this.hideModal}
          onExited={this.handleModalOnExited}>
          <Modal.Body>
            <Modal.Title>
              {!selectedClient ? "I expected a client to be selected" :
              (<div>
                Client:<strong>{selectedClientName}</strong>
                <br/>
                Household size: <strong>{selectedClient.householdSize}</strong>
                <br/>
                Card color: <strong>{selectedClient.cardColor}</strong>
                <span style={{
                    backgroundColor: selectedClient.cardColor,
                    color: selectedClient.cardColor == "yellow" ? "black" : "white",
                    padding: "5px 5px 2px 5px",
                    margin: "5px",
                }}>
                  <Glyphicon glyph="th-list"/>
                </span>
                <br />
                {(this.state.showModal == "pending") && (
                  <Button bsStyle="info" bsSize="large" block>
                    <Glyphicon glyph="refresh" className={s.spinning} /> Recording visit...
                  </Button>
                )}
                {(this.state.showModal == "completed") && (
                  <Button bsStyle="primary" bsSize="large" block>
                    <Glyphicon glyph="ok-circle" /> Finished
                  </Button>
                )}
              </div>)}
            </Modal.Title>
          </Modal.Body>
        </Modal>

        <Grid>
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
            </Col>
            <Col xs={4}>
              <Button
                bsSize="lg"
                block
                bsStyle="primary"
                disabled={selectedClient ? false : true }
                onClick={this.handleCheckIn}>
                  Check-in
                  { selectedClient ?
                      " " + selectedClientName + " " :
                      " Client "}
                  <Glyphicon glyph="check"/>
              </Button>
              <Button bsStyle="link">Register a new household<Glyphicon glyph="plus"/></Button>
            </Col>
          </Row>
          <Row>
            <Col xs={7}>
              <Clients
                clients={currentPageClients}
                header
                householdBadge
                selectedClientId={selectedClient ? selectedClient.id : null}
                onClientSelect={(client, index) => {this.handleClientSelect(client, index, "onClientSelect")}}
                onClientDoubleClick={this.handleClientDoubleClick}
                showSelection/>
              <Pagination
                next
                prev
                boundaryLinks
                ellipsis
                items={pages}
                maxButtons={5}
                activePage={page}
                onSelect={this.handlePageSelect} />
            </Col>
            <Col xs={2}>
              <Visits visits={this.state.visits} onDeleteVisit={this.handleDeleteVisit}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);
