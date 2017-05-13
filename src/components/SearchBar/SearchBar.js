/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component, PropTypes} from 'react';
import { fetch } from '../common';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBar.css';
import Clients from '../Clients';
import Visits from '../Visits';
import Link from '../Link';
import { Button, Col, Dropdown, Glyphicon, Grid, MenuItem, Modal, Pagination, Row } from 'react-bootstrap';
import history from '../../core/history';

class SearchBar extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
        householdSize: PropTypes.number.isRequired,
        cardColor: PropTypes.string.isRequired,
        lastCheckin: PropTypes.string,
      })).isRequired,
  }

  constructor(props) {
    super(props);

    this.clients = this.props.clients.map( (c) => {
      let fullName = c.firstName.toLowerCase() + " " + c.lastName.toLowerCase();
      c.nameParts = fullName.split(" ");
      c.histogram = this.buildLetterHistogram(fullName);
      return c;
    });

    this.state = {
      filter: "",
      visits: [],
      selectedIndex: 0,
      showModal: false,
      date: this.getToday(),
      showDateSpinner: false,
    };

    this.handleCheckIn = this.handleCheckIn.bind(this);
    this.handleDeleteVisit = this.handleDeleteVisit.bind(this);
    this.handleModalOnExited = this.handleModalOnExited.bind(this);
    this.handleNextDay = this.handleNextDay.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handlePreviousDay = this.handlePreviousDay.bind(this);
    this.handleResetDate = this.handleResetDate.bind(this);
    this.handleShowDate = this.handleShowDate.bind(this);

    this.hideModal = this.hideModal.bind(this);
  }

  alreadyVisited(client) {
    let daysSinceLastVisit = new Date() - new Date(client.lastVisit);
    return (daysSinceLastVisit < 3 * 24 * 60 * 60 * 1000);
  }


  buildLetterHistogram(value) {
    let arr = new Array(27);
    arr.fill(0);
    value = value.toLowerCase();
    let littleA = "a".charCodeAt(0);
    for(var i = 0; i < value.length; i++) {
      let v = value.charCodeAt(i) - littleA;
      if((v < 0) || v >=26) {
        v = 26;
      }
      arr[v]++;
    }

    return arr;
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
    filter = filter.toLowerCase();
    var filteredClients = this.clients;

    if(filter.length > 0) {
      let filterParts = filter.split(" ");

      filteredClients = filteredClients.map( (client) => {
        let exactMatch = 0;
        let nameParts = client.nameParts;
        filterParts.forEach( (filterPart) => {
          if(nameParts.some( (namePart) => {
            return namePart.startsWith(filterPart);
          })) {
            exactMatch += filterPart.length;
          }
        });

        let filterHist = this.buildLetterHistogram(filter);
        //we want to do a merge join of chars and the search string
        //and calculate count of extra a missing characters
        let missing = 0;
        let extra = 0;
        let matched = 0;

        for(let i = 0; i < filterHist.length; i++) {
          let v = filterHist[i] - client.histogram[i];
          if(v <= 0) {
            missing -= v; //v is negative, so this is addition
            matched += filterHist[i];
          } else { //(v > 0)
            extra += v;
            matched += client.histogram[i];
          }
        }

        Object.assign(client,
          {
            missing,
            extra,
            matched,
            exactMatch,
          });

        return client;
      });

      //we want at least one character to match
      filteredClients = filteredClients.filter( (client) => {
        return client.matched > client.extra;
      });
    }

    filteredClients.sort( (a, b) => {
      let cmp = 0;
      if(filter.length > 0) {
        cmp = -(a.exactMatch - b.exactMatch);
        if(cmp != 0) return cmp;
        cmp = -(a.matched - b.matched);
        if(cmp != 0) return cmp;
        cmp = a.extra - b.extra;
        if(cmp != 0) return cmp;
        cmp = a.missing - b.missing;
        if(cmp != 0) return cmp;
      }
      cmp = a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase());
      if(cmp != 0) return cmp;
      cmp = a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
      return cmp
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

  date2Obj(date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

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
    if(!date) date = new Date();
    if(!date.year) date = this.date2Obj(date);
    return [date.year, date.month, date.day].join("-");
  }

  getToday() {
    return this.date2Obj(new Date());
  }

  handleCheckIn() {
    var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
    var selectedClient = pageTuple.selectedClient;
    if(selectedClient && !this.alreadyVisited(selectedClient)) {
      this.setState({showModal: "pending"});
      let query = `mutation{recordVisit(
        householdId: ${selectedClient.householdId},
        year:${this.state.date.year},
        month:${this.state.date.month},
        day:${this.state.date.day}){date}}`;
      let dataAvailable = fetch(query).then( () => {
        return this.loadVisits(selectedClient, "handleCheckIn");
      });

      function shortDelay(msec, value) {
        var delay = new Promise( (resolve, reject) => {
          window.setTimeout( () => { resolve(value); }, msec);
        });
        return delay;
      }

      var completed = Promise.all([dataAvailable, shortDelay(700)]).then( () => {
        this.setState({
          showModal: "completed",
        });
        return shortDelay(1000);
      }).then( () => {
        this.hideModal();
     });
    }
  }


  handleClientSelect = (client, index, src) => {
    //console.log(client, index);
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
    let query = "mutation{deleteVisit(id:" + id + ") {id}}";
    let dataAvailable = fetch(query);
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
      case "e":
        if(e.ctrlKey) {
          e.preventDefault();
          var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
          var selectedClient = pageTuple.selectedClient;
          history.push("/households/" + selectedClient.householdId);
        }
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

  handleNextDay() {
    let date = this.obj2Date(this.state.date);
    date.setDate(date.getDate() + 1);
    this.setState({date: this.date2Obj(date)});
  }

  handlePageSelect(pageNumber) {
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

  handlePreviousDay() {
    let date = this.obj2Date(this.state.date);
    date.setDate(date.getDate() - 1);
    this.setState({date: this.date2Obj(date)});
  }

  handleShowDate() {
    this.setState( { showDateSpinner: true, });
  }

  handleResetDate() {
    this.setState( {
      date: this.getToday(),
      showDateSpinner: false
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

  handleModalOnExited() {
    var searchBar = this.refs.clientFilterText;
    searchBar.focus();
    searchBar.setSelectionRange(0, searchBar.value.length);
  }

  hideModal() {
    this.setState({showModal: false});
  }

  loadVisits(client, src) {
    //console.log(src);
    let query = '{visitsForHousehold(householdId: ' + client.householdId + '){id date}}';
    let dataAvailable = fetch(query);
    dataAvailable.then( (json) => {
      let visits = json.data.visitsForHousehold;

      let lastVisit = visits.reduce( (acc, cv) => {
        return (acc == null || cv.date > acc) ? cv.date : acc;
      }, null);

      this.clients.forEach( (c) => {
        if( c.householdId == client.householdId) {
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
    var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
    var currentPageClients = pageTuple.currentPageClients;
    var page = pageTuple.page;
    var pages = pageTuple.pages;
    var selectedClient = pageTuple.selectedClient;
    var selectedClientName = selectedClient ? selectedClient.firstName + " " + selectedClient.lastName : "";


    let modal = (
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
    );

    let alreadyVisited = selectedClient && this.alreadyVisited(selectedClient);

    let mainLayout = (
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
            <Clients
              clients={currentPageClients}
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
                {" "}<Glyphicon glyph="check"/>
            </Button>
            <br/>
            <div style={{display: this.state.showDateSpinner ? "block" : "none"}}>
              {this.obj2Date(this.state.date).
               toLocaleDateString('en-US', {month: "short", day: "numeric", year: "numeric"})}
              {" "}
              <Button onClick={this.handlePreviousDay}><Glyphicon glyph="chevron-left" /></Button>
              <Button onClick={this.handleNextDay}><Glyphicon glyph="chevron-right" /></Button>
            </div>
            <Link to="/households/-1">Register a new household <Glyphicon glyph="plus"/></Link>
            <Visits visits={this.state.visits} onDeleteVisit={this.handleDeleteVisit}/>
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

export default withStyles(s)(SearchBar);
