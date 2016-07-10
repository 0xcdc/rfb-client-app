/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { GraphQLList as List } from 'graphql';
import fetch from '../../core/fetch';
import ClientItemType from '../types/ClientItemType';


let items = [
{ name: "Charlie" },
{ name: "Darian" },
{ name: "Enda" },
{ name: "Brian" },
{ name: "Meghann"},
{ name: "Rich"},
{ name: "Rob"},
];

const clients = {
  type: new List(ClientItemType),
  resolve() {
    return items;
  },
};

export default clients;
