/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBar.css';
import Clients from '../Clients';
import Visits from '../Visits';
import { Col, Grid, Pagination, Row } from 'react-bootstrap';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      page: 1,
    };
  }

  handleSeachBoxChange = (event) => {
    this.setState( { filter: event.target.value } );
  }

  handlePageSelect = (pageNumber) => {
    this.setState({
      page: pageNumber
    });
  }

  render() {
    var searchString = this.state.filter;
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

    var pages = Math.floor((filteredClients.length - 1) / 10) + 1;
    var page = this.state.page < pages ? this.state.page : pages;

    var lastItem = page * 10;
    var firstItem = lastItem - 10;
    var currentPageClients = filteredClients.slice(firstItem, lastItem);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Grid>
          <Row>
            <Col xs={8}>
              <input
                className={s.searchBar}
                type="text"
                onChange={this.handleSeachBoxChange}
                placeholder="Enter any part of the clients name to filter"/>
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <Clients clients={currentPageClients} header />
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
              <Visits visits={[{date: "1"},{date: "2"},{date: "3"},{date: "4"}]}/>
            </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);

