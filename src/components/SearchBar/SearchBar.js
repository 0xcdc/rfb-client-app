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
import Client from '../Client';
import ReactList from 'react-list';

class SearchBar extends Component {
  constructor({clients}) {
    super();
    this.clients = clients
    this.state = { filter: ""};
    this.filteredClients = clients;
  }

  handleChange = (event) => {
    this.setState({ filter: event.target.value});
  }

  renderClient(index, key) {
    return <Client key={this.filteredClients[index].personId} client={this.filteredClients[index]} />
  }

  render() {
    var terms = this.state.filter.split(' ');
    var filteredClients = this.clients;
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

    this.filteredClients = filteredClients;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <input className={s.searchBar} type="text" onChange={this.handleChange} placeholder="Type here"/>
          <div className={s.clients}>
            <ReactList
              itemRenderer={::this.renderClient}
              length={this.filteredClients.length}
              type='uniform'
              useStaticSize={true}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);

