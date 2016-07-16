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

class SearchBar extends Component {
  constructor({clients}) {
    super();
    this.clients = clients
    this.state = { filter: ""};
  }

  handleChange = (event) => {
    this.setState({ filter: event.target.value});
  }

  render() {
    var terms = this.state.filter.split(' ');
    var filteredClients = this.clients;
    while(terms.length > 0) {
        var term = terms.pop();
        filteredClients = filteredClients.filter( (client) => {
          return client.name.toLowerCase().includes(term.toLowerCase());
        })
    }

    return (
      <div id="searchBar"><input type="text" onChange={this.handleChange} placeholder="Type here"/>
        <ul id="clients">
        {
            filteredClients.map((client) => (
              <Client key={client.name} client={client} />
            )) 
        }
        </ul>
      </div>
    );
  }
}

export default withStyles(s)(SearchBar);

