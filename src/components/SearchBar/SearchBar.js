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
import { Button, Col, Glyphicon, Grid, Pagination, Row } from 'react-bootstrap';

class SearchBar extends Component {
  static propTypes = {
    clients: PropTypes.arrayOf(PropTypes.shape({
        personId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        householdId: PropTypes.number.isRequired,
      })).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      visits: [],
      selectedIndex: 0,
    };
    var pageTuple = this.currentPageClients("", 0);
    if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient);
    }

    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
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

  }

  handleOnClientSelect = (client, index) => {
    this.loadVisits(client);
    var newSelectedIndex = Math.floor(this.state.selectedIndex / 10) * 10 + index;
    this.setState({
      selectedIndex: newSelectedIndex,
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
      default:
        //console.log(e.key);
    }
    if(newIndex != selectedIndex) {
      var pageTuple = this.currentPageClients(this.state.filter, newIndex);
      if(pageTuple.selectedIndex != selectedIndex) {
        this.setState({ selectedIndex: pageTuple.selectedIndex});
        this.loadVisits(pageTuple.selectedClient);
      }
    }
  }

  handlePageSelect = (pageNumber) => {
    var currentPageNumber = Math.floor(this.state.selectedIndex / 10) + 1;
    var newSelectedIndex = 10 * (pageNumber - currentPageNumber) + this.state.selectedIndex;
    var pageTuple = this.currentPageClients(this.state.filter, newSelectedIndex);
    if(pageTuple.selectedClient) {
      this.loadVisits(pageTuple.selectedClient);
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
      this.loadVisits(pageTuple.selectedClient);
    }
  }

  loadVisits(client) {
    fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: '{visitsForHousehold(householdId: ' + client['householdId'] + '){date}}'
      }),
      credentials: 'include',
    }).then( (response) => {
      return response.json();
    }).then( (json) => {
      this.setState({
        visits: json.data.visitsForHousehold,
      });
    })
  }

  render() {
    var pageTuple = this.currentPageClients(this.state.filter, this.state.selectedIndex);
    var currentPageClients = pageTuple.currentPageClients;
    var page = pageTuple.page;
    var pages = pageTuple.pages;
    var selectedClient = pageTuple.selectedClient;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Grid>
          <Row>
            <Col xs={8}>
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
                bsStyle="default"
                disabled={selectedClient ? false : true }
                onClick={this.handleCheckIn}>
                  Check-in
                  { selectedClient ?
                      " " + selectedClient.firstName + " " + selectedClient.lastName + " " :
                      " Client "}
                  <Glyphicon glyph="check"/>
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <Clients
                clients={currentPageClients}
                header
                selectedClientId={selectedClient ? selectedClient.personId : null}
                onClientSelect={this.handleOnClientSelect}
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
              <Visits visits={this.state.visits}/>
            </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);
